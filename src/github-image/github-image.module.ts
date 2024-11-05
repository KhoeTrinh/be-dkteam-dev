import { Module } from '@nestjs/common';
import { GithubImageService } from './github-image.service';
import { GithubImageController } from './github-image.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [GithubImageService],
  controllers: [GithubImageController],
})
export class GithubImageModule {}
