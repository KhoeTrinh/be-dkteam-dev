import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get('/')
    GetComments() {}

    @Post('/')
    CreateComment() {}

    @Put('/:id')
    UpdateCommentById() {}

    @Delete('/:id')
    DeleteCommentById() {}

    // For Admin
    @Put('/:id/admin')
    UpdateCommentByIdAdmin() {}
    
    @Delete('/:id/admin')
    DeleteCommentByIdAdmin() {}
}
