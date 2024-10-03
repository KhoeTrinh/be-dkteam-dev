import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
    // For users & Admin
    @Get('/')
    Check() {}

    @Post('/login')
    Login() {}

    @Post('/signup')
    Signup() {}

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
