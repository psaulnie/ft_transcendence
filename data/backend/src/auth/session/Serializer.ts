import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../entities';
import { Done } from '../../utils/types';
import { AuthProvider } from '../service/auth.provider';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthProvider,
  ) {
    super();
  }

  serializeUser(user: User, done: Done) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Done) {
    const userDb = await this.authService.findUser(user.intraId);
    console.log('In deserializer: ', userDb);
    return userDb ? done(null, userDb) : done(null, null);
  }
}
