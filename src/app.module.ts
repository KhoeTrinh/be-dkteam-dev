import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [UsersModule, ProductsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
