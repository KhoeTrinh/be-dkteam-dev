import { Module } from '@nestjs/common';
import { AboutmeController } from './aboutme.controller';
import { AboutmeService } from './aboutme.service';

@Module({
  controllers: [AboutmeController],
  providers: [AboutmeService]
})
export class AboutmeModule {}
