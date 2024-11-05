import { Module } from '@nestjs/common';
import { GithubImageService } from './github-image.service';
import { GithubImageController } from './github-image.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [GithubImageService],
  controllers: [GithubImageController]
})
export class GithubImageModule {}
