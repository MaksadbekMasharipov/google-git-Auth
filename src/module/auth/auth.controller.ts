import { Controller, Get, Post, Body, HttpCode, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyDto } from './dto/verify.dto';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@ApiInternalServerErrorResponse({ description: "Serverda xatolik yuz berdi" })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @Post('register')
  @HttpCode(201)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  // verify
  @ApiResponse({ status: 200, description: 'Code sent' })
  @ApiBadRequestResponse({ description: 'Invalid OTP' })
  @ApiBadRequestResponse({ description: 'Wrong OTP' })
  @ApiBadRequestResponse({ description: 'expired OTP' })
  @ApiUnauthorizedResponse({ description: 'Email not found' })
  @Post('verify')
  @HttpCode(200)
  verify(@Body() dto: VerifyDto) {
    return this.authService.verify(dto);
  }

  // login
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Wrong password' })
  @ApiOkResponse({ description: 'Please check your email'})
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Google ga murojaat
  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  googleAuth(@Req() req) {
    return;
  }

  // Ma'lumotlarni Google dan olish va token berish
  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  googleRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('github')
  @UseGuards(PassportAuthGuard('github'))
  githubAuth(@Req() req) {
    return;
  }

  @Get('github/callback')
  @UseGuards(PassportAuthGuard('github'))
  githubRedirect(@Req() req) {
    return this.authService.githubLogin(req);
  }
}
