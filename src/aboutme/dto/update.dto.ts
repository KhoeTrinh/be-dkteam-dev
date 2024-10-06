import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateDto {
    @IsNotEmpty()
    @IsString()
    title?: string

    @IsNotEmpty()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    image?: string
}