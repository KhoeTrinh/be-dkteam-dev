import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentsModule } from './comments/comments.module';
import { AboutmeModule } from './aboutme/aboutme.module';

@Module({
  imports: [UsersModule, ProductsModule, PrismaModule, CommentsModule, AboutmeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
