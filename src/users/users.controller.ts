import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { UpdateDto } from './dto/update.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  // For users & Admin
  @Get('/')
  @UseGuards(JwtGuard)
  Check(@Req() req: Request) {
    return {
      message: this.userService.check(),
      user: req.user,
      statusCode: 200,
    };
  }

  @Post('/login')
  async Login(@Req() req: Request, @Body() data: LoginDto) {
    const result = await this.userService.login(data)
    req.user = result.token
    return {
      message: result.user,
      token: req.user,
      statusCode: 200,
    };
  }

  @Post('/signup')
  async Signup(@Req() req: Request, @Body() data: SignupDto) {
    const result = await this.userService.signup(data)
    req.user = result.token
    return {
      message: result.user,
      token: req.user,
      statusCode: 201,
    }
  }

  @Post('/logout')
  Logout() {
    return { message: this.userService.logout(), statusCode: 204 };
  }

  @Put('/:id')
  async UpdateById(@Param('id') id: string, @Body() data: UpdateDto) {
    return {
      message: await this.userService.updateById(id, data),
      statusCode: 200,
    }
  }

  @Delete('/:id')
  async DeleteById(@Param('id') id: string) {
    return {
      message: await this.userService.deleteById(id),
      statusCode: 204,
    }
  }

  // For Admin
  @Get('/admin')
  AllUsers() {}

  @Get('/:id/admin')
  UserById() {}

  @Put('/:id/admin')
  UpdateByIdAdmin() {}

  @Delete('/:id/admin')
  DeleteByIdAdmin() {}
}
