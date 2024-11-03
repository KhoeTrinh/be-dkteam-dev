import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

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
    if (!path) throw new HttpException('Please provide a path', 4000);
    try {
      const res = await lastValueFrom(
        this.httpService.get(`${this.url}/${path}`, this.headers),
      );
      return res.data.content;
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
      return res.data.content
    } catch (err) {}
  }

  updateImage() {}

  deleteImage() {}
}
