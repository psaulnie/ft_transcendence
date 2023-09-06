import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { UsersService } from '../../users/users.service';
import twoFactorPayload from '../service/twoFactorPayload.interface';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(private readonly userService: UsersService) {
    super({});
  }

  async validate(payload: twoFactorPayload) {
    const user = await this.userService.findOneById(payload.userId);
    if (!user.isTwoFactorAuthEnabled) {
      return user;
    }
    if (payload.isSecondFactorAuthenticated) {
      return user;
    }
  }
}
