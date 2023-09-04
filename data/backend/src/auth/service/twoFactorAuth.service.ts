import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../../entities';
import { UsersService } from '../../users/users.service';
import { toFileStream } from 'qrcode';
import e from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const serviceName = 'Transcendence';

    const otpAuthUrl = authenticator.keyuri(user.username, serviceName, secret);

    await this.usersService.setTwoFactorAuthSecret(secret, user.uid);

    return {
      secret,
      otpAuthUrl,
    };
  }

  public async pipeQrCodeStream(stream: e.Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  public isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFactorAuthSecret,
    });
  }

  async isTwoFactorAuthTurnedOn(user: User) {
    return await this.usersService.isTwoFactorAuthEnabled(user.uid);
  }
}
