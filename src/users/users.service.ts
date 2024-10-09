import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UpdateDto } from './dto/update.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import axios from 'axios';

@Injectable()
export class UsersService {
  private readonly githubApiUrl = process.env.GITHUB_URL;
  private readonly personalAccessToken = process.env.PERSONAL_ACCESS_TOKEN;
  private readonly owner = process.env.OWNER;
  private readonly repo = process.env.REPO;
  private readonly message = process.env.MESSAGE;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async hashPass(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async check(req: Request) {
    const User = req.user as User;
    let userimage = null;
    if (User.userImage) {
      userimage = await this.getFileFromGithub(User.userImage);
    }
    return {
      user: User,
      message: 'Checked',
      imagePath: User.userImage || null,
      image: userimage || null,
    };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new HttpException('User not found', 400);
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new HttpException('Password does not match', 400);
    const { password: _, ...userData } = user;
    const token = this.jwtService.sign(userData);
    return { user: userData, token };
  }

  async signup({ password, ...data }: Prisma.UserCreateInput) {
    const findUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (findUser) throw new HttpException('Email has already existed', 400);
    const hash = await this.hashPass(password);
    const user = await this.prisma.user.create({
      data: { password: hash, ...data },
    });
    const { password: _, ...userData } = user;
    const token = this.jwtService.sign(userData);
    return { user: userData, token };
  }

  logout() {
    return 'Ok';
  }

  async updateById(
    id: string,
    data: UpdateDto,
    req: Request,
    fileContent: Buffer,
    path: string,
  ) {
    const User = req.user as User;
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new HttpException('User not found', 400);
    if (User.id !== user.id)
      throw new HttpException('You can not updated another user', 400);
    if(path) {
      await this.uploadFileToGithub(fileContent, path)
      const updatedUser = await this.prisma.user.update({ where: {id: id}, data: { userImage: path}})
      delete updatedUser.password
      const token = this.jwtService.sign(updatedUser)
      return { user: updatedUser, token}
    }
    if (data.email && data.email !== user.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new HttpException('Email has already existed', 400);
      }
    }
    if (data.prevPassword || data.password || data.confirmPassword) {
      if (!data.prevPassword || !data.password || !data.confirmPassword)
        throw new HttpException(
          'All password fields (prevPassword, password, confirmPassword) are required if 1 of them are provided.',
          400,
        );
      if (!(await bcrypt.compare(data.prevPassword, user.password)))
        throw new HttpException('Old password does not match', 400);
      if (data.password !== data.confirmPassword)
        throw new HttpException('Confirm password does not match', 400);
    }

    const updatedData = {
      ...data,
      password: data.password
        ? await this.hashPass(data.password)
        : user.password,
    };
    delete updatedData.prevPassword;
    delete updatedData.confirmPassword;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
    delete updatedUser.password;
    const token = this.jwtService.sign(updatedUser);
    return { user: updatedUser, token };
  }

  async deleteById(id: string, req: Request) {
    const User = req.user as User;
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new HttpException('User not found', 400);
    if (User.id !== user.id)
      throw new HttpException('You can not delete another user', 400);
    await this.prisma.user.delete({ where: { id } });
    return 'Ok';
  }

  async allUsers() {
    const userArray = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        userImage: true,
        authorProd: {
          select: {
            author: { select: { title: true, productImage: true } },
          },
        },
        aboutme: { select: { title: true, description: true, image: true } },
      },
    });
    const processedUsers = [];
    for (const user of userArray) {
      const { userImage, authorProd, aboutme, ...userData } = user;
      const userimage = await this.getFileFromGithub(userImage);
      let aboutmeimage = null;
      if (aboutme && aboutme.image) {
        aboutmeimage = await this.getFileFromGithub(aboutme.image);
      }
      const filteredAuthorProd = authorProd.map(async (ap) => {
        let productimage = null;
        if (ap.author.productImage) {
          productimage = await this.getFileFromGithub(ap.author.productImage);
        }
        return {
          author: {
            title: ap.author.title,
            productImagePath: ap.author.productImage || null,
            productImage: productimage || null,
          },
        };
      });
      processedUsers.push({
        ...userData,
        imagePath: userImage,
        image: userimage || null,
        aboutme: aboutme
          ? { image: aboutmeimage || null, imagePath: aboutme.image }
          : null,
        authorProd: await Promise.all(filteredAuthorProd),
      });
    }
    return processedUsers;
  }

  async userById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        userImage: true,
        authorProd: {
          select: {
            author: { select: { title: true, productImage: true } },
          },
        },
        aboutme: { select: { title: true, description: true, image: true } },
      },
    });
    if (!user) throw new HttpException('User not found', 400);
    const { userImage, authorProd, aboutme, ...userData } = user;
    const userimage = await this.getFileFromGithub(userImage);
    let aboutmeimage = null;
    if (aboutme && aboutme.image) {
      aboutmeimage = await this.getFileFromGithub(aboutme.image);
    }
    const filteredAuthorProd = authorProd.map(async (ap) => {
      let productimage = null;
      if (ap.author.productImage) {
        productimage = await this.getFileFromGithub(ap.author.productImage);
      }
      return {
        author: {
          title: ap.author.title,
          productImagePath: ap.author.productImage || null,
          productImage: productimage || null,
        },
      };
    });
    return {
      ...userData,
      imagePath: userImage,
      image: userimage || null,
      aboutme: aboutme
        ? { image: aboutmeimage || null, imagePath: aboutme.image }
        : null,
      authorProd: await Promise.all(filteredAuthorProd),
    };
  }

  async updateByIdAdmin(id: string, data: Record<string, UpdateAdminDto>) {
    const idArray = id.split(',');
    if (new Set(idArray).size !== idArray.length)
      throw new HttpException('Duplicate Id are not allowed', 400);
    const bodyIds = Object.keys(data);
    if (idArray.length !== bodyIds.length) {
      throw new HttpException(
        `Mismatch between URL IDs and request body IDs. URL contains ${idArray.length} IDs, but body contains ${bodyIds.length} IDs.`,
        400,
      );
    }
    if (
      (
        await this.prisma.user.findMany({
          where: { id: { in: idArray } },
        })
      ).length !== idArray.length
    )
      throw new HttpException('One or more Ids are invalid', 400);
    const result = [];
    for (const userid of idArray) {
      const userdata = data[userid];
      if (!userdata)
        throw new HttpException(`No data provided for user Id: ${userid}`, 400);
      const dto = plainToInstance(UpdateAdminDto, userdata);
      if (validateSync(dto).length > 0)
        throw new HttpException(`Validation failed for user Id: ${id}`, 400);
      if (!(await this.prisma.user.findUnique({ where: { id: userid } })))
        throw new HttpException(`User ${userid} not found`, 400);
      if (dto.isAdmin === true && dto.isDev !== true)
        throw new HttpException(
          `If the user with id of ${userid} is an admin, he need to be a dev too`,
          400,
        );
      const user = await this.prisma.user.update({
        where: { id: userid },
        data: dto,
      });
      delete user.password;
      result.push(user);
    }
    return result;
  }

  async deleteByIdAdmin(id: string) {
    const idArray = id.split(',');
    if (new Set(idArray).size !== idArray.length)
      throw new HttpException('Duplicate Id are not allowed', 400);
    if (
      (
        await this.prisma.user.findMany({
          where: { id: { in: idArray } },
        })
      ).length !== idArray.length
    )
      throw new HttpException('One or more Ids are invalid', 400);
    await this.prisma.user.deleteMany({ where: { id: { in: idArray } } });
    return 'Ok';
  }

  async getFileFromGithub(path: string) {
    if (!path) throw new HttpException('Please provide a path', 400);
    const url = `${this.githubApiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `token ${this.personalAccessToken}`,
        },
      });
      return res.data.content;
    } catch {}
  }

  async uploadFileToGithub(fileContent: Buffer, path: string) {
    if (!fileContent) throw new HttpException('Please provide a file', 400);
    const url = `${this.githubApiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;
    const encodedContent = fileContent.toString('base64');
    let sha = null;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `token ${this.personalAccessToken}`,
        },
      });
      if (res.status !== 200)
        throw new HttpException('Invalid access token', 400);
      sha = res.data.sha;
    } catch {
      throw new HttpException('Error fetching commit', 500);
    }
    const data = {
      message: this.message,
      content: encodedContent,
      sha,
    };
    try {
      const res = await axios.put(url, data, {
        headers: {
          Authorization: `token ${this.personalAccessToken}`,
        },
      });
      if (res.status !== 200)
        throw new HttpException('Invalid access token', 400);
      return res.data;
    } catch {
      throw new HttpException('Error updating file', 500);
    }
  }
}
