import { Body, Controller, Delete, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { AboutmeService } from './aboutme.service';
import { JwtGuard } from 'src/users/guards/jwt.guard';
import { DevInterceptor } from 'src/users/intercepters/dev.interceptor';
import { AdminInterceptor } from 'src/users/intercepters/admin.interceptor';
import { CreateDto } from './dto/create.dto';

@Controller('aboutme')
export class AboutmeController {
    constructor(private aboutmeService: AboutmeService) {}
    @Post('/')
    @UseGuards(JwtGuard)
    @UseInterceptors(DevInterceptor)
    async CreateAboutme(@Body() data: CreateDto) {
        return {
            message: await this.aboutmeService.createAboutme(data),
            statusCode: 200,
        };
    }

    @Put('/:id')
    @UseGuards(JwtGuard)
    @UseInterceptors(DevInterceptor)
    UpdateAboutmeById() {}

    @Delete('/:id')
    @UseGuards(JwtGuard)
    @UseInterceptors(DevInterceptor)
    DeleteAboutmeById() {}

    // For Admin
    @Put('/:id/admin')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    UpdateAboutmeByIdAdmin() {}

    @Delete('/:id/admin')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    DeleteAboutmeByIdAdmin() {}
}
