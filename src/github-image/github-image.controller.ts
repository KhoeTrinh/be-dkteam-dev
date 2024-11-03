import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('github-image')
export class GithubImageController {
    @Get()
    GetImage() {}

    @Post()
    UploadImage() {}

    @Put()
    UpdateImage() {}

    @Delete()
    DeleteImage() {}
}
