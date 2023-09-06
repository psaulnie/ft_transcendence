import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import * as process from 'process';
import { AuthProvider } from '../service/auth.provider';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthProvider,
  ) {
    super({
      clientID: process.env.INTRA_CLIENT_ID,
      clientSecret: process.env.INTRA_CLIENT_SECRET,
      callbackURL: process.env.INTRA_REDIRECT_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('INTRA AUTH STRATEGY');
    const { id: intraId, username } = profile;
    console.log(`intra-auth.strategies.ts: validate: 
‣ id: ${intraId},
‣ username: ${username},
‣ accessToken: ${accessToken},
‣ refreshToken: ${refreshToken}`);
    const details = {
      intraId,
      username,
      accessToken,
      refreshToken,
      urlAvatar: '',
      intraUsername: username,
    };
    return this.authService.validateUser(details);
  }
}
