import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TwoFactorAuthService } from '../service/twoFactorAuth.service';
import { Response } from 'express';
import RequestWithUser from '../service/requestWithUser.interface';
import { AuthenticatedGuard } from '../guards/intra-auth-guard.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post('generate')
  @UseGuards(AuthenticatedGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    console.log('GENERATE CONTROLLER (2FA)');
    const { otpAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return this.twoFactorAuthService.pipeQrCodeStream(response, otpAuthUrl);
  }

  @Post('test')
  test() {
    return 'Test successful!';
  }
}
