import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  allProducts() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        link: true,
        title: true,
        description: true,
        publishDate: true,
        author: {
          select: {
            authorProd: {
              select: { id: true, userImage: true, username: true },
            },
          },
        },
      },
    });
  }

  async productById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
      select: {
        id: true,
        link: true,
        title: true,
        description: true,
        publishDate: true,
        author: {
          select: {
            authorProd: {
              select: { id: true, userImage: true, username: true },
            },
          },
        },
      },
    });
    if (!product) throw new HttpException('Product not found', 400);
    return product;
  }

  async createProduct(data: CreateDto) {
    const findProduct = await this.prisma.product.findUnique({
      where: { title: data.title },
    });
    if (findProduct) {
      throw new HttpException('This title is already existed', 400);
    }
    const idSet = new Set();
    for (const user of data.author) {
      if (idSet.has(user.id)) {
        throw new HttpException('Duplicate Id are not allowed', 400);
      }
      idSet.add(user.id);
      const findUser = await this.prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!findUser)
        throw new HttpException(
          `User with id of ${user.id} was not found`,
          404,
        );
    }
    const product = await this.prisma.product.create({
      data: {
        link: data.link,
        title: data.title,
        description: data.description,
        author: {
          create: data.author.map((user) => ({
            authorProd: { connect: { id: user.id } },
          })),
        },
      },
    });

    return product;
  }

  updateProductById() {}

  deleteProductById() {}
}
