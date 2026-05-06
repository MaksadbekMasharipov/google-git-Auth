import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @ApiProperty({default: 'Maqsadbek'}) // vazifasi: swagger da bu field ni ko'rsatish uchun ishlatiladi
    username!: string;
    
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({default: 'maksadbekmasharipov@gmail.com'})
    email!: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    @ApiProperty({default: 'Password123'})
    password!: string;
}
