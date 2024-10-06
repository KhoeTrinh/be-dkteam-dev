import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    image?: string

    @IsNotEmpty()
    @IsString()
    author: string
}