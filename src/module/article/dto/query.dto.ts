import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class QueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({default: 1, minimum: 1})
    page?: number;


    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({default: 1, minimum: 1})
    limit?: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    search?: string;
}