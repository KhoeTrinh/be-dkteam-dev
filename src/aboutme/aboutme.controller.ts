import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AboutmeService } from './aboutme.service';
import { JwtGuard } from 'src/users/guards/jwt.guard';
import { DevInterceptor } from 'src/users/intercepters/dev.interceptor';
import { AdminInterceptor } from 'src/users/intercepters/admin.interceptor';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Request } from 'express';

@Controller('aboutme')
export class AboutmeController {
  constructor(private aboutmeService: AboutmeService) {}
  @Post('/')
  @UseGuards(JwtGuard)
  @UseInterceptors(DevInterceptor)
  async CreateAboutme(@Req() req: Request, @Body() data: CreateDto) {
    return {
      message: await this.aboutmeService.createAboutme(data, req),
      statusCode: 200,
    };
  }

  @Put('/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(DevInterceptor)
  async UpdateAboutmeById(
    @Param('id') id: string,
    @Body() data: UpdateDto,
  ) {
    return {
      message: await this.aboutmeService.updateAboutmeById(
        id,
        data,
      ),
      statusCode: 200,
    };
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(DevInterceptor)
  async DeleteAboutmeById(@Param('id') id: string) {
    return {
      message: await this.aboutmeService.deleteAboutmeById(id),
      statusCode: 204,
    };
  }

  // For Admin
  @Put('/:id/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  async UpdateAboutmeByIdAdmin(
    @Param('id') id: string,
    @Body() data: UpdateDto,
  ) {
    return {
      message: await this.aboutmeService.updateAboutmeByIdAdmin(id, data),
      statusCode: 200,
    };
  }

  @Delete('/:id/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  async DeleteAboutmeByIdAdmin(@Param('id') id: string) {
    return {
      message: await this.aboutmeService.deleteAboutmeByIdAdmin(id),
      statusCode: 204,
    };
  }
}
