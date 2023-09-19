import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TwoFactorAuthService } from '../service/twoFactorAuth.service';
import { Response } from 'express';
import RequestWithUser from '../service/requestWithUser.interface';
import { IntraAuthenticatedGuard } from '../guards/intraAuthGuard.service';
import { UsersService } from '../../users/users.service';
import { TwoFactorAuthCodeDto } from '../dto/twoFactorAuthCode.dto';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('getState')
  @HttpCode(200)
  async getTwoFactorAuthState(@Req() request: RequestWithUser) {
    if (!request.isAuthenticated()) return false;
    return await this.usersService.getTwoFactorAuthState(request.user.uid);
  }

  @Post('changeState')
  @HttpCode(200)
  @UseGuards(IntraAuthenticatedGuard)
  async changeTwoFactorAuthState(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthState },
  ) {
    console.log(
      'In State endpoint, 2FaState: ',
      twoFactorAuthState,
      typeof twoFactorAuthState,
    );
    if (!twoFactorAuthState) {
      await this.usersService.turnOffTwoFactorAuth(request.user.uid);
    }
    return await this.usersService.changeTwoFactorAuthState(
      request.user.uid,
      twoFactorAuthState,
    );
  }

  @Post('generate')
  @UseGuards(IntraAuthenticatedGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return this.twoFactorAuthService.pipeQrCodeStream(response, otpAuthUrl);
  }

  /**
   * Now, the user can generate a QR code (with /2fa/generate endpoint),
   * save it in the Google Authenticator application,
   * and send a valid code to the /2fa/turn-on endpoint.
   * If that’s the case, we acknowledge that the two-factor authentication
   * has been saved.
   * @param request
   * @param twoFactorAuthCode
   */
  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(IntraAuthenticatedGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      request.user,
    );
    if (!isCodeValid) {
      return {
        status: 'codeError',
        message: 'Wrong authentication code',
      };
    }
    await this.usersService.turnOnTwoFactorAuth(request.user.uid);
    await this.usersService.setIsTwoFactorAuthenticated(request.user.uid, true);
    return { status: 'success', message: '2FA is turned on' };
  }

  @Get('status')
  @HttpCode(200)
  @UseGuards(IntraAuthenticatedGuard)
  async status(@Req() request: RequestWithUser) {
    return await this.twoFactorAuthService.isTwoFactorAuthTurnedOn(
      request.user,
    );
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(IntraAuthenticatedGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      request.user,
    );
    if (!isCodeValid) {
      return {
        status: 'codeError',
        message: 'Wrong authentication code',
      };
    }
    await this.usersService.setIsTwoFactorAuthenticated(request.user.uid, true);
    return { status: 'success', message: 'User authenticated with 2FA' };
  }
}
