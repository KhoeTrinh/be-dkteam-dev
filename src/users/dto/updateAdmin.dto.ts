import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  userImage?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}