import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches} from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({default: 'maksadbekmasharipov@gmail.com'})
    email!: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    @ApiProperty({default: 'Password123'})
    password!: string;
}
