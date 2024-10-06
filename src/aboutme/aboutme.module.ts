import { Module } from '@nestjs/common';
import { AboutmeController } from './aboutme.controller';
import { AboutmeService } from './aboutme.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AboutmeController],
  providers: [AboutmeService]
})
export class AboutmeModule {}
