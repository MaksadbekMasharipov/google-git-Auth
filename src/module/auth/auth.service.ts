import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
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

    // Google login


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
    } else {
      return {message: "Wrong password."};
    }
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('Google authentication failed');
    }
    return this.handleOAuthLogin(req.user);
  }

  async githubLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('GitHub authentication failed');
    }
    return this.handleOAuthLogin(req.user);
  }

  private async handleOAuthLogin(userProfile: any) {
    const email = userProfile.email;
    if (!email) {
      throw new BadRequestException('OAuth provider did not return an email');
    }

    let user = await this.authRepo.findOne({ where: { email } });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashPassword = await bcrypt.hash(randomPassword, 10);
      const username = userProfile.username || email.split('@')[0];

      user = this.authRepo.create({
        username,
        email,
        password: hashPassword,
        otp: '',
        otpTime: 0,
        firstName: userProfile.firstName || userProfile.displayName || '',
        lastName: userProfile.lastName || '',
        profilePicture: userProfile.profilePicture || userProfile.picture || '',
        accessToken: userProfile.accessToken || '',
      });
      await this.authRepo.save(user);
    } else {
      user.firstName = userProfile.firstName || user.firstName;
      user.lastName = userProfile.lastName || user.lastName;
      user.profilePicture = userProfile.profilePicture || userProfile.picture || user.profilePicture;
      user.accessToken = userProfile.accessToken || user.accessToken;
      await this.authRepo.save(user);
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      },
    };
  }
}
