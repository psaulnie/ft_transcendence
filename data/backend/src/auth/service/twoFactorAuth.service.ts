import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../../entities';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { toFileStream } from 'qrcode';
import e from 'express';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    console.log('GENERATE TWO FACTOR AUTH SECRET SERVICE');
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      user.username,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.uid);

    return {
      secret,
      otpAuthUrl,
    };
  }

  public async pipeQrCodeStream(stream: e.Response, otpAuthUrl: string) {
    console.log('PIPE QRCODE STREAM SERVICE');
    return toFileStream(stream, otpAuthUrl);
  }
}
