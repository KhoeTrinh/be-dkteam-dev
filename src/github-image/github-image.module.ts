import { Module } from '@nestjs/common';
import { GithubImageService } from './github-image.service';
import { GithubImageController } from './github-image.controller';

@Module({
  providers: [GithubImageService],
  controllers: [GithubImageController]
})
export class GithubImageModule {}
