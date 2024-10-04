import { IsBoolean, IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  userPicture?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}

export class UpdateAdminDtoList {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => UpdateAdminDto)
  updates: { [key: string]: UpdateAdminDto };
}