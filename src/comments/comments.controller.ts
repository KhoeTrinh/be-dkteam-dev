import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtGuard } from 'src/users/guards/jwt.guard';
import { AdminInterceptor } from 'src/users/intercepters/admin.interceptor';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get('/')
    @UseGuards(JwtGuard)
    GetComments() {}

    @Post('/')
    @UseGuards(JwtGuard)
    async CreateComment(@Req() req: Request, @Body() data: CreateDto) {
        return {
            message: await this.commentsService.createComment(data, req),
            statusCode: 200,
        }
    }

    @Put('/:id')
    @UseGuards(JwtGuard)
    UpdateCommentById() {}

    @Delete('/:id')
    @UseGuards(JwtGuard)
    DeleteCommentById() {}

    // For Admin
    @Put('/:id/admin')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    UpdateCommentByIdAdmin() {}
    
    @Delete('/:id/admin')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    DeleteCommentByIdAdmin() {}
}
