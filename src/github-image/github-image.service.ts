import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubImageService {
  private readonly githubApiUrl = process.env.GITHUB_URL;
  private readonly personalAccessToken = process.env.PERSONAL_ACCESS_TOKEN;
  private readonly owner = process.env.OWNER;
  private readonly repo = process.env.REPO;
  private readonly message = process.env.MESSAGE;

  getImage() {}

  uploadImage() {}

  deleteImage() {}
}
