import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GithubImageService } from './github-image.service';
import { Response } from 'express';
import { JwtGuard } from 'src/users/guards/jwt.guard';
import { AdminInterceptor } from 'src/users/intercepters/admin.interceptor';
import { of } from 'rxjs';

@Controller('github-image')
export class GithubImageController {
  constructor(
    private githubImageService: GithubImageService,
    private jwtGuard: JwtGuard,
    private adminInterceptor: AdminInterceptor,
  ) {}
  @Post('/get')
  async GetImage(@Body() path: { path: string }, @Res() res: Response) {
    const buffer = await this.githubImageService.getImage(path.path);
    res.set({
      'Content-Type': 'image/jpeg',
    });
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
  async UploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { id: string; type: string },
    context: ExecutionContext,
  ) {
    if (data.type === 'product') {
      const isAuth = await this.jwtGuard.canActivate(context);
      if (!isAuth) throw new HttpException('Unauthorized', 400);
      await this.adminInterceptor.intercept(context, {
        handle: () => of(null),
      });
    }
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
