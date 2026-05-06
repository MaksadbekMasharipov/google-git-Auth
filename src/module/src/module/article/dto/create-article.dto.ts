import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsInt, IsString } from "class-validator";
import { Tag } from "src/module/tag/entities/tag.entity";


export class CreateArticleDto {
    @IsString()
    @ApiProperty({ default: "Will AI take our job? 😱"})
    title!: string;

    @IsString()
    @ApiProperty({ default: "NO"})
    content!: string;

    @Transform(({ value }) =>
    typeof value === "string"
    ? value.split(",").map((item) => Number(item))
    : value
    )

    @ApiProperty({default: [1, 2]})
    @IsArray()
    @IsInt({ each: true }) // Har bir eleman integer bo'lishi kerakligini tekshiradi
    tags!: number[];
}
