import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";


export class VerifyDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({default: 'maqsadbek@gmail.com'}) 
  email!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({default: '123456'}) 
  otp!: string;
}