import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AboutmeService {
  constructor(private prisma: PrismaService) {}

  async createAboutme(data: CreateDto, req: Request) {
    const findAboutme = await this.prisma.aboutme.findUnique({
      where: { title: data.title },
    });
    const User = req.user as User;
    if (User.id !== data.author)
      throw new HttpException('You can not create aboutme for other user', 400);
    if (findAboutme)
      throw new HttpException('This title is already existed', 400);
    const findUser = await this.prisma.user.findUnique({
      where: { id: data.author },
      include: { aboutme: true },
    });
    if (!findUser) throw new HttpException('This User Id was not found', 400);
    if (findUser.aboutme)
      throw new HttpException('You already have an aboutme', 400);
    return this.prisma.aboutme.create({
      data: { ...data, author: { connect: { id: data.author } } },
    });
  }

  async updateAboutmeById(id: string, data: UpdateDto) {
    const aboutme = await this.prisma.aboutme.findUnique({ where: { id: id } });
    if (!aboutme) throw new HttpException('About me not found', 400);
    if (id !== aboutme.id)
      throw new HttpException('You can not update another user aboutme', 400);
    if (data.title && data.title !== aboutme.title)
      throw new HttpException('This title is already existed', 400);
    return this.prisma.aboutme.update({ where: { id: id }, data: data });
  }

  async deleteAboutmeById(id: string) {
    const aboutme = await this.prisma.aboutme.findUnique({ where: { id: id } });
    if (!aboutme) throw new HttpException('About me not found', 400);
    if (id !== aboutme.id)
      throw new HttpException('You can not delete another user aboutme', 400);
    await this.prisma.aboutme.delete({ where: { id: id } });
    return 'Ok';
  }

  async updateAboutmeByIdAdmin(id: string, data: UpdateDto) {
    const aboutme = await this.prisma.aboutme.findUnique({ where: { id: id } });
    if (!aboutme) throw new HttpException('About me not found', 400);
    if (data.title && data.title !== aboutme.title)
      throw new HttpException('This title is already existed', 400);
    return this.prisma.aboutme.update({ where: { id: id }, data: data });
  }

  async deleteAboutmeByIdAdmin(id: string) {
    const aboutme = await this.prisma.aboutme.findUnique({ where: { id: id } });
    if (!aboutme) throw new HttpException('About me not found', 400);
    await this.prisma.aboutme.delete({ where: { id: id } });
    return 'Ok';
  }
}
