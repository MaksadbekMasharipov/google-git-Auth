import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('GITHUB_CALLBACK_URL') ||
        'http://localhost:4001/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const emails = profile.emails || [];
    const email = emails[0]?.value;
    const name = profile.displayName || profile.username || '';
    const [firstName, ...rest] = name.split(' ');

    const user = {
      githubId: profile.id,
      email,
      username: profile.username || email?.split('@')[0] || '',
      firstName: firstName || '',
      lastName: rest.join(' ') || '',
      profilePicture: profile.photos?.[0]?.value || '',
      accessToken,
    };
    done(null, user);
  }
}
