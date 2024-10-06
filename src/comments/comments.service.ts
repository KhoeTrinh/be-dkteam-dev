import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  getComments() {}

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

  updateCommentById() {}

  deleteCommentById() {}

  updateCommentByIdAdmin() {}

  deleteCommentByIdAdmin() {}
}
