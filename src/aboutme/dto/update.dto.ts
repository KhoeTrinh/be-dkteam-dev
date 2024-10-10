import { IsOptional, IsString } from "class-validator"

export class UpdateDto {
    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    image?: string
}