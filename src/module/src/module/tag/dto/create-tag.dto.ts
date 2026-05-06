import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
    @IsString()
    @ApiProperty({ default: "JavaScript"})
    @IsNotEmpty()
    name!: string;
}
