import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GithubImageService } from './github-image.service';
import { Response } from 'express';

@Controller('github-image')
export class GithubImageController {
  constructor(private githubImageService: GithubImageService) {}
  @Post('/get')
  async GetImage(@Body() path: { path: string }, @Res() res: Response) {
    const buffer = await this.githubImageService.getImage(path.path);
    res.set({
      'Content-Type': 'image/jpeg'
    })
    res.send(buffer);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  UploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { id: string; type: string },
  ) {
    return this.githubImageService.uploadImage(
      file.buffer,
      file.originalname,
      data.id,
      data.type,
    );
  }

  @Delete()
  DeleteImage(@Body() data: { path: string; id: string; type: string }) {
    return this.githubImageService.deleteImage(data.path, data.id, data.type);
  }
}
