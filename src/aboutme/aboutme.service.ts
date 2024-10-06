import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class AboutmeService {
  constructor(private prisma: PrismaService) {}

  async createAboutme(data: CreateDto) {
    const findAboutme = await this.prisma.aboutme.findUnique({
      where: { title: data.title },
    });
    if (findAboutme)
      throw new HttpException('This title is already existed', 400);
    const findUser = await this.prisma.user.findUnique({
      where: { id: data.author },
    });
    if (!findUser) throw new HttpException('This User Id was not found', 400);
    return this.prisma.aboutme.create({
      data: { ...data, author: { connect: { id: data.author } } },
    });
  }

  async updateAboutmeById(id: string, data: UpdateDto) {
    const aboutme = await this.prisma.aboutme.findUnique({ where: { id: id } });
    if (!aboutme) throw new HttpException('User not found', 400);
    if (data.title && data.title !== aboutme.title)
      throw new HttpException('This title is already existed', 400);
    return this.prisma.aboutme.update({ where: { id: id }, data: data });
  }

  deleteAboutmeById() {}

  updateAboutmeByIdAdmin() {}

  deleteAboutmeByIdAdmin() {}
}
