import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { AdminInterceptor } from './intercepters/admin.interceptor';
import { UpdateDto } from './dto/update.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { DevInterceptor } from './intercepters/dev.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  // For users & Admin
  @Get('/')
  @UseGuards(JwtGuard)
  async Check(@Req() req: Request) {
    const res = await this.userService.check(req);
    return {
      status: res.message,
      message: res.user,
      statusCode: 200,
      image: res.image,
    };
  }

  @Get('/:id/admin')
  @UseGuards(JwtGuard)
  async UserById(@Param('id') id: string) {
    return { message: await this.userService.userById(id), statusCode: 200 };
  }

  @Post('/login')
  async Login(@Req() req: Request, @Body() data: LoginDto) {
    const result = await this.userService.login(data);
    req.user = result.token;
    return {
      message: result.user,
      token: req.user,
      statusCode: 200,
    };
  }

  @Post('/signup')
  async Signup(@Req() req: Request, @Body() data: SignupDto) {
    const result = await this.userService.signup(data);
    req.user = result.token;
    return {
      message: result.user,
      token: req.user,
      statusCode: 201,
    };
  }

  @Post('/logout')
  @UseGuards(JwtGuard)
  Logout() {
    return { message: this.userService.logout(), statusCode: 204 };
  }

  @Put('/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('userImage'))
  async UpdateById(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Param('id') id: string,
    @Body() data: UpdateDto,
  ) {
    const result = await this.userService.updateById(
      id,
      data,
      req,
      file?.buffer,
      file?.originalname,
    );
    req.user = result.token;
    return {
      message: result.user,
      token: req.user,
      statusCode: 200,
    };
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async DeleteById(@Req() req: Request, @Param('id') id: string) {
    return {
      message: await this.userService.deleteById(id, req),
      statusCode: 204,
    };
  }

  // For Admin
  @Get('/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(DevInterceptor)
  async AllUsers() {
    return { message: await this.userService.allUsers(), statusCode: 200 };
  }

  @Put('/:id/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  async UpdateByIdAdmin(
    @Param('id') id: string,
    @Body() data: Record<string, UpdateAdminDto>,
  ) {
    return {
      message: await this.userService.updateByIdAdmin(id, data),
      statusCode: 200,
    };
  }

  @Delete('/:id/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  async DeleteByIdAdmin(@Param('id') id: string) {
    return {
      message: await this.userService.deleteByIdAdmin(id),
      statusCode: 204,
    };
  }
}
