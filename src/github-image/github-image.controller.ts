import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('github-image')
export class GithubImageController {
    @Get()
    GetImage() {}

    @Post()
    UploadImage() {}

    @Delete()
    DeleteImage() {}
}
