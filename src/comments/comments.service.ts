import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { UpdateDto } from './dto/update.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService, private userService: UsersService) {}

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
    await this.prisma.comment.delete({ where: { id: id } });
    return 'Ok';
  }

  async updateCommentByIdAdmin(id: string, data: Record<string, UpdateDto>) {
    const idArray = id.split(',');
    if (new Set(idArray).size !== idArray.length)
      throw new HttpException('Duplicate Id are not allowed', 400);
    const bodyIds = Object.keys(data);
    if (idArray.length !== bodyIds.length)
      throw new HttpException(
        `Mismatch between URL IDs and request body IDs. URL contains ${idArray.length} IDs, but body contains ${bodyIds.length} IDs.`,
        400,
      );
    if (
      (
        await this.prisma.comment.findMany({
          where: { id: { in: idArray } },
        })
      ).length !== idArray.length
    )
      throw new HttpException('One or more Ids are invalid', 400);
    const result = [];
    for (const commentId of idArray) {
      const commentData = data[commentId];
      if (!commentData)
        throw new HttpException(
          `No data provided for comment Id: ${commentId}`,
          400,
        );
      const dto = plainToInstance(UpdateDto, commentData);
      if (validateSync(dto).length > 0)
        throw new HttpException(`Validation failed for comment Id: ${id}`, 400);
      if (!(await this.prisma.comment.findUnique({ where: { id: commentId } })))
        throw new HttpException(`Comment ${commentId} not found`, 400);
      const comment = await this.prisma.comment.update({
        where: { id: commentId },
        data: dto,
      });
      result.push(comment);
    }
    return result;
  }

  async deleteCommentByIdAdmin(id: string) {
    const idArray = id.split(',');
    if (new Set(idArray).size !== idArray.length)
      throw new HttpException('Duplicate Id are not allowed', 400);
    if (
      (
        await this.prisma.comment.findMany({
          where: { id: { in: idArray } },
        })
      ).length !== idArray.length
    )
      throw new HttpException('One or more Ids are invalid', 400);
    for (const commentId of idArray) {
      if (!(await this.prisma.comment.findUnique({ where: { id: commentId } })))
        throw new HttpException(`Comment ${commentId} not found`, 400);
      await this.prisma.comment.delete({
        where: { id: commentId },
      });
    }
    return 'Ok';
  }
}
