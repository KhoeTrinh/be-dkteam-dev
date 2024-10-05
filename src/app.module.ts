import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [UsersModule, ProductsModule, PrismaModule, CommentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
