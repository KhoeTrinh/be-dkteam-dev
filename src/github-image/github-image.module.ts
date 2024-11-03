import { Module } from '@nestjs/common';
import { GithubImageService } from './github-image.service';
import { GithubImageController } from './github-image.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GithubImageService],
  controllers: [GithubImageController]
})
export class GithubImageModule {}
