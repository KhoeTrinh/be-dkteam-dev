import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    check() {}

    login() {}

    signup(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({ data: data})
    }

    logout() {}

    updateById() {}

    deleteById() {}

    allUsers() {}

    userById() {}

    updateByIdAdmin() {}

    deleteByIdAdmin() {}
}
