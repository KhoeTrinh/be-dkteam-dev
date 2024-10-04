import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { UpdateDto } from './dto/update.dto';
import { AdminInterceptor } from './intercepters/admin.interceptor';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  // For users & Admin
  @Get('/')
  @UseGuards(JwtGuard)
  Check(@Req() req: Request) {
    const res = this.userService.check(req);
    return {
      message: res.message,
      user: res.user,
      statusCode: 200,
    };
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
  Logout() {
    return { message: this.userService.logout(), statusCode: 204 };
  }

  @Put('/:id')
  @UseGuards(JwtGuard)
  async UpdateById(@Param('id') id: string, @Body() data: UpdateDto) {
    return {
      message: await this.userService.updateById(id, data),
      statusCode: 200,
    };
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async DeleteById(@Param('id') id: string) {
    return {
      message: await this.userService.deleteById(id),
      statusCode: 204,
    };
  }

  // For Admin
  @Get('/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  async AllUsers() {
    return { message: await this.userService.allUsers(), statusCode: 200 };
  }

  @Get('/:id/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  async UserById(@Param('id') id: string) {
    return { message: await this.userService.userById(id), statusCode: 200 };
  }

  @Put('/:id/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  UpdateByIdAdmin() {}

  @Delete('/:id/admin')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  DeleteByIdAdmin() {}
}
