import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UpdateDto } from './dto/update.dto';
import { UpdateAdminDtoList } from './dto/updateAdmin.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async hashPass(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  check(req: Request) {
    return { user: req.user as User, message: 'Checked' };
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

  async updateById(id: string, data: UpdateDto, req: Request) {
    const User = req.user as User;
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new HttpException('User not found', 400);
    if (User.id !== user.id)
      throw new HttpException('You can not updated another user', 400);
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

  async deleteById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new HttpException('User not found', 400);
    await this.prisma.user.delete({ where: { id } });
    return 'Ok';
  }

  allUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        userImage: true,
        username: true,
        email: true,
        isAdmin: true,
      },
    });
  }

  userById(id: string) {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        userImage: true,
        username: true,
        email: true,
        isAdmin: true,
      },
    });
    if (!user) throw new HttpException('User not found', 400);
    return user;
  }

  async updateByIdAdmin(id: string, data: UpdateAdminDtoList) {
    const idArray = id.split(',');
    const uniqueId = new Set(idArray);
    if (uniqueId.size !== idArray.length)
      throw new HttpException('Duplicate Id are not allowed', 400);
    const users = await this.prisma.user.findMany({
      where: { id: { in: idArray } },
    });
    if (users.length !== idArray.length)
      throw new HttpException('One or more Ids are invalid', 400);
    console.log(data);
    return users;
  }

  deleteByIdAdmin() {}
}
