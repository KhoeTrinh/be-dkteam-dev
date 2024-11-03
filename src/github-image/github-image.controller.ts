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
    const { buffer, mimeType } = await this.githubImageService.getImage(
      path.path,
    );
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="image${mimeType.split('/')[1]}"`,
      'Content-Length': buffer.length,
    });
    res.status(HttpStatus.OK).send(buffer);
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
  UploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.githubImageService.uploadImage(file.buffer, file.originalname);
  }

  @Delete()
  DeleteImage(@Body() path: { path: string }) {
    return this.githubImageService.deleteImage(path.path);
  }
}
