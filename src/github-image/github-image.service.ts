import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { extname } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GithubImageService {
  private readonly githubApiUrl = process.env.GITHUB_URL;
  private readonly personalAccessToken = process.env.PERSONAL_ACCESS_TOKEN;
  private readonly owner = process.env.OWNER;
  private readonly repo = process.env.REPO;
  private readonly message = process.env.MESSAGE;
  private url: string = `${this.githubApiUrl}/repos/${this.owner}/${this.repo}/contents`;
  private headers = {
    headers: {
      Authorization: `token ${this.personalAccessToken}`,
    },
  };

  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}
  async getImage(path: string) {
    if (!path) throw new HttpException('Please provide a path', 400);
    try {
      const res = await lastValueFrom(
        this.httpService.get(`${this.url}/${path}`, {
          ...this.headers,
          responseType: 'arraybuffer',
        }),
      );
      return Buffer.from(res.data);
    } catch (err) {}
  }

  async uploadImage(file: Buffer, path: string, id: string, type: string) {
    if (!file) throw new HttpException('Please provide a file', 400);
    const encodedContent = file.toString('base64');
    let sha = null;
    try {
      const res = await lastValueFrom(
        this.httpService.get(`${this.url}/${path}`, this.headers),
      );
      sha = res.data.sha;
    } catch (err) {}
    const data = {
      message: this.message,
      content: encodedContent,
      sha,
    };
    try {
      const res = await lastValueFrom(
        this.httpService.put(`${this.url}/${path}`, data, this.headers),
      );
      const modelMapping: { [key: string]: { model: string; field: string } } =
        {
          user: { model: 'user', field: 'userImage' },
          product: { model: 'product', field: 'productImage' },
          aboutme: { model: 'aboutme', field: 'image' },
        };
      const normalizedType = type.trim().toLowerCase();
      if (!modelMapping.hasOwnProperty(normalizedType)) {
        throw new HttpException('Invalid type', 400);
      }
      const { model, field } = modelMapping[type];
      const updateData = { [field]: path };
      await this.prisma[model].update({
        where: { id },
        data: updateData,
      });
      return res.data.content;
    } catch (err) {
      throw err instanceof HttpException
        ? err
        : new HttpException('Image upload failed', 500);
    }
  }

  async deleteImage(path: string, id: string, type: string) {
    if (!path) throw new HttpException('Please provide a path', 400);
    let sha = null;
    try {
      const res = await lastValueFrom(
        this.httpService.get(`${this.url}/${path}`, this.headers),
      ).catch(() => {
        throw new HttpException('File not found', 400);
      });
      sha = res.data.sha;
    } catch (err) {}
    const data = {
      message: this.message,
      sha,
    };
    try {
      await lastValueFrom(
        this.httpService.delete(`${this.url}/${path}`, {
          data: data,
          ...this.headers,
        }),
      );
      const modelMapping: {
        [key: string]: { model: string; field: string; image: string };
      } = {
        user: {
          model: 'user',
          field: 'userImage',
          image: 'assets/svg/user-svgrepo-com.svg',
        },
        product: {
          model: 'product',
          field: 'productImage',
          image: 'assets/svg/gear-10-svgrepo-com.svg',
        },
        aboutme: {
          model: 'aboutme',
          field: 'image',
          image: 'assets/svg/user-svgrepo-com.svg',
        },
      };
      const normalizedType = type.trim().toLowerCase();
      if (!modelMapping.hasOwnProperty(normalizedType)) {
        throw new HttpException('Invalid type', 400);
      }
      const { model, field, image } = modelMapping[type];
      const updateData = { [field]: image };
      await this.prisma[model].update({
        where: { id },
        data: updateData,
      });
      return 'Ok';
    } catch (err) {
      throw err instanceof HttpException
        ? err
        : new HttpException('Image upload failed', 500);
    }
  }
}
