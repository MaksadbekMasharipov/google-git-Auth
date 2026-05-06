import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import nodemailer from 'nodemailer';
import { VerifyDto } from './dto/verify.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private nodemailer: nodemailer.Transporter;
  constructor(@InjectRepository(Auth) private authRepo: Repository<Auth>,
  private jwtService: JwtService
  ) {
    this.nodemailer = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "maksadbekmasharipov@gmail.com",
        pass: process.env.APP_KEY,
      },
    });
  }  // data base bilan bog'lab beradi va nodemailer ni sozlaydi

  

    // register
  async register(createAuthDto: CreateAuthDto) {
    const { username, email, password } = createAuthDto;

    const foundedUser = await this.authRepo.findOne({where: {email: email}});
    if (foundedUser) {
      throw new BadRequestException('User already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    const time = Date.now() + 120000; // OTPning amal qilish vaqti (2 daqiqa)

    await this.nodemailer.sendMail({
      from: "maksadbekmasharipov@gmail.com",
      to: email,
      subject: "OTP for registration",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });    // OTP ni yuborish


    const user = this.authRepo.create({username, email, password: hashPassword, otp, otpTime: time});

    await this.authRepo.save(user);

    return {message: "User registered successfully. Please check your email for the OTP."};
  }


    // verify
  async verify(dto: VerifyDto) {
    const { email, otp } = dto;

    const user = await this.authRepo.findOne({where: {email: email}});
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (Date.now() > user.otpTime) {
      throw new BadRequestException('OTP has expired');
    }

    user.otp = '';
    user.otpTime = 0;
    await this.authRepo.save(user);


    const payload = { id: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

    // login
    async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const foundedUser = await this.authRepo.findOne({where: {email: email}});
    if (!foundedUser) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, foundedUser.password);

    if (isPasswordValid) {
      const otp = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
      const time = Date.now() + 120000; // OTPning amal qilish vaqti (2 daqiqa)

      foundedUser.otp = otp;
      foundedUser.otpTime = time;
      await this.authRepo.save(foundedUser);

      await this.nodemailer.sendMail({
        from: "maksadbekmasharipov@gmail.com",
        to: email,
        subject: "OTP for login",
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP is: <b>${otp}</b></p>`,
      });

      await this.authRepo.update(foundedUser.id, {otp, otpTime: time});

    return {message: "Please check your email for the OTP."};
  }else{
    return {message: "Wrong password."};
  }
  }
}