import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(data: CreateDto, req: Request) {
    const User = req.user as User;
    const findProduct = await this.prisma.product.findUnique({
      where: { id: data.product },
    });
    if (!findProduct) throw new HttpException('Product not found', 400);
    return this.prisma.comment.create({
      data: {
        ...data,
        author: { connect: { id: User.id } },
        product: { connect: { id: data.product } },
      },
    });
  }

  async updateCommentById(id: string, data: UpdateDto, req: Request) {
    const findComment = await this.prisma.comment.findUnique({
      where: { id: id },
    });
    if (!findComment) throw new HttpException('Comment not found', 400);
    const User = req.user as User;
    if (findComment.authorId !== User.id)
      throw new HttpException('You can not update another user comment', 400);
    return this.prisma.comment.update({ where: { id: id }, data: data });
  }

  async deleteCommentById(id: string, req: Request) {
    const findComment = await this.prisma.comment.findUnique({
      where: { id: id },
    });
    if (!findComment) throw new HttpException('Comment not found', 400);
    const User = req.user as User;
    if (findComment.authorId !== User.id)
      throw new HttpException('You can not update another user comment', 400);
    await this.prisma.comment.delete({ where: { id: id }});
    return 'Ok'
  }

  updateCommentByIdAdmin() {}

  deleteCommentByIdAdmin() {}
}
