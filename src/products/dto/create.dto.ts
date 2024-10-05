import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  author: { id: string }[];
}
