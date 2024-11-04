import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { extname } from 'path';

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

  constructor(private httpService: HttpService) {}
  async getImage(path: string) {
    if (!path) throw new HttpException('Please provide a path', 400);
    try {
      const res = await lastValueFrom(
        this.httpService.get(`${this.url}/${path}`, this.headers),
      );
      const { download_url, content } = res.data;
      const buffer = Buffer.from(content, 'base64');
      const cleanUrl = download_url.split('?')[0];
      const extension = extname(cleanUrl).toLowerCase();
      let mimeType: string;
      switch (extension) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
        case '.png':
          mimeType = 'image/png';
          break;
        case '.gif':
          mimeType = 'image/gif';
          break;
        case '.bmp':
          mimeType = 'image/bmp';
          break;
        case '.webp':
          mimeType = 'image/webp';
          break;
        default:
          mimeType = 'application/octet-stream';
      }
      return { buffer, mimeType };
    } catch (err) {}
  }

  async uploadImage(file: Buffer, path: string) {
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
      return res.data.content;
    } catch (err) {}
  }

  async deleteImage(path: string) {
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
          headers: {
            Authorization: `token ${this.personalAccessToken}`,
          },
        }),
      );
      return 'Ok';
    } catch (err) {}
  }
}
