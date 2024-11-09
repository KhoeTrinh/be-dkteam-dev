import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async allProducts() {
    const productArray = await this.prisma.product.findMany({
      select: {
        id: true,
        link: true,
        title: true,
        description: true,
        publishDate: true,
        productImage: true,
        author: {
          select: {
            authorProd: {
              select: { id: true, userImage: true, username: true },
            },
          },
        },
        comments: {
          select: {
            id: true,
            description: true,
            author: {
              select: {
                id: true,
                username: true,
                userImage: true
              },
            },
          },
        },
      },
    });
    const processedProducts = [];
    for (const product of productArray) {
      const { productImage, author, comments, ...productData } = product;
      const filteredAuthor = author.map(async (ap) => {
        return {
          authorProd: {
            userImagePath: ap.authorProd.userImage || null,
            username: ap.authorProd.username,
          },
        };
      });
      const processedComments = comments.map(async (comment) => {
        return {
          id: comment.id,
          description: comment.description,
          author: {
            id: comment.author.id,
            username: comment.author.username,
            userImage: comment.author.userImage || null,
          },
        };
      });
      processedProducts.push({
        ...productData,
        imagePath: productImage,
        author: await Promise.all(filteredAuthor),
        comments: await Promise.all(processedComments),
      });
    }
    return processedProducts;
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
        productImage: true,
        author: {
          select: {
            authorProd: {
              select: { userImage: true, username: true, id: true },
            },
          },
        },
        comments: {
          select: {
            id: true,
            description: true,
            author: {
              select: {
                id: true,
                username: true,
                userImage: true,
              },
            },
          },
        },
      },
    });
    if (!product) throw new HttpException('Product not found', 400);
    const { productImage, author, comments, ...productData } = product;
    const filteredAuthor = author.map(async (ap) => {
      return {
        authorProd: {
          userImagePath: ap.authorProd.userImage || null,
          username: ap.authorProd.username,
          id: ap.authorProd.id
        },
      };
    });
    const processedComments = comments.map(async (comment) => {
      return {
        id: comment.id,
        description: comment.description,
        author: {
          id: comment.author.id,
          username: comment.author.username,
          userImage: comment.author.userImage || null,
        },
      };
    });
    return {
      ...productData,
      imagePath: productImage,
      author: await Promise.all(filteredAuthor),
      comments: await Promise.all(processedComments),
    };
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

  async updateProductById(id: string, data: UpdateDto) {
    const product = await this.prisma.product.findUnique({ where: { id: id } });
    if (!product) throw new HttpException('Product not found', 400);
    if (data.title && data.title !== product.title) {
      const findProduct = await this.prisma.product.findUnique({
        where: { title: data.title },
      });
      if (findProduct)
        throw new HttpException('This title is already existed', 400);
    }
    if (data.author) {
      const idSet = new Set();
      for (const user of data.author) {
        if (idSet.has(user.id))
          throw new HttpException('Duplicate Id are not allowed', 400);
        idSet.add(user.id);
        const findUser = await this.prisma.user.findUnique({
          where: { id: user.id },
        });
        if (!findUser)
          throw new HttpException(
            `User with id of ${user.id} was not found`,
            400,
          );
      }
      await this.prisma.usersOnProducts.deleteMany({
        where: { authorId: id },
      });
      await this.prisma.usersOnProducts.createMany({
        data: data.author.map((user) => ({
          authorProdId: user.id,
          authorId: id,
        })),
      });
    }
    return this.prisma.product.update({
      where: { id: id },
      data: {
        title: data.title,
        link: data.link,
        description: data.description,
      },
    });
  }

  async deleteProductById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id: id } });
    if (!product) throw new HttpException('Product not found', 400);
    await this.prisma.product.delete({ where: { id: id } });
    return 'Ok';
  }
}
