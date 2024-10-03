import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  check() {}

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new HttpException('User not found', 400);
    if (user.password !== data.password)
      throw new HttpException('Password does not match', 400);
    return user;
  }

  signup(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data: data });
  }

  logout() {
    return 'Ok'
  }

  updateById() {}

  deleteById() {}

  allUsers() {}

  userById() {}

  updateByIdAdmin() {}

  deleteByIdAdmin() {}
}
