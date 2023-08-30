import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
  Body,
} from '@nestjs/common';
import { TwoFactorAuthService } from '../service/twoFactorAuth.service';
import { Response } from 'express';
import RequestWithUser from '../service/requestWithUser.interface';
import {
  IntraAuthGuard,
  AuthenticatedGuard,
} from '../guards/intraAuthGuard.service';
import { UsersService } from '../../users/users.service';
import { TwoFactorAuthCodeDto } from '../dto/twoFactorAuthCode.dto';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Now, the user can generate a QR code, save it in the Google Authenticator
   * application, and send a valid code to the /2fa/turn-on endpoint.
   * If that’s the case, we acknowledge that the two-factor authentication
   * has been saved.
   * @param request
   * @param twoFactorAuthCode
   */
  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuth(request.user.uid);
  }

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

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(IntraAuthGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    // const accessTokenCookie = AuthService.getCookieWithJwtAccessToken(
    //   request.user.uid,
    //   true,
    // );
    //
    // request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }
}
