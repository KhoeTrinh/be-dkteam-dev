import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Put,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  // For users & Admin
  @Get('/')
  Check() {}

  @Post('/login')
  async Login(@Body() data: LoginDto) {
    return { message: await this.userService.login(data), statusCode: 200 };
  }

  @Post('/signup')
  async Signup(@Body() data: SignupDto) {
    return { message: await this.userService.signup(data), statusCode: 201 };
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
