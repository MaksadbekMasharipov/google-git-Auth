import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export class ArticleResponseDto {
    @IsNumber()
    @ApiProperty({ default: 1})
    id!: number;

    @IsString()
    @ApiProperty({ default: "Will AI take our job? 😱"})
    title!: string;

    @IsString()
    @ApiProperty({ default: "NO"})
    content!: string;
}
