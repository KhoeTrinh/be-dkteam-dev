import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    author: string
}