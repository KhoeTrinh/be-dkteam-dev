import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    // For users & Admin
    @Get('/')
    Check() {}

    @Post('/login')
    Login() {}

    @Post('/signup')
    Signup(@Body() data: SignupDto) {
        return this.userService.signup(data)
    }

    @Post('/logout')
    Logout() {}

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
