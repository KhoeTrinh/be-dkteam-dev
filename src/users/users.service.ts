import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createToken({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) throw new HttpException('User not found', 400);
    if (password === user.password) {
      const { password, ...data } = user;
      return this.jwtService.sign(data);
    }
  }

  async hashPass(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  check() {
    return 'Checked';
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

  async updateById(id: string, data: UpdateDto) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new HttpException('User not found', 400);
    if (
      await this.prisma.user.findUnique({
        where: { email: data.email, NOT: { id: id } },
      })
    )
      throw new HttpException('Email has already existed', 400);
    if (!(await bcrypt.compare(data.prevPassword, user.password)))
      throw new HttpException('Old password does not match', 400);
    if (data.password !== data.confirmPassword)
      throw new HttpException('Confirm password does not match', 400);
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
    return updatedUser;
  }

  deleteById() {}

  allUsers() {}

  userById() {}

  updateByIdAdmin() {}

  deleteByIdAdmin() {}
}
