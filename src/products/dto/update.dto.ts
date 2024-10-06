import { IsArray, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateDto {
    @IsOptional()
    @IsUrl()
    link?: string;
    @IsOptional()
    @IsString()
    productImage?: string
    @IsOptional()
    @IsString()
    title?: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsArray()
    author?: { id: string }[];
}