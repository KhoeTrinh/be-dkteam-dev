import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  allProducts() {}

  productById() {}

  createProduct() {}

  updateProductById() {}

  deleteProductById() {}
}
