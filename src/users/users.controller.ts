import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';

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
  @UseGuards(LocalGuard)
  async Login(@Req() req: Request, @Body() data: LoginDto) {
    return {
      message: await this.userService.login(data),
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
      token: result.token,
      statusCode: 201,
    }
  }

  @Post('/logout')
  Logout() {
    return { message: this.userService.logout(), statusCode: 204 };
  }

  @Put('/:id')
  UpdateById() {}

  @Delete('/:id')
  DeleteById() {}

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
