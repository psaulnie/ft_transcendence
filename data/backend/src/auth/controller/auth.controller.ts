import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { IntraAuthGuard } from '../guards/intraAuthGuard.service';
import { User } from '../../entities';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import RequestWithUser from '../service/requestWithUser.interface';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: NestHttpService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * GET /auth/login
   * This is the route the user will visit to authenticate
   */
  @Get('login')
  @UseGuards(IntraAuthGuard)
  login() {
    return;
  }

  /**
   * GET /auth/redirect
   * This is the redirect URL the OAuth2 Provider will call.
   */
  @Get('redirect')
  @UseGuards(IntraAuthGuard)
  redirect(@Res() res: Response, @Req() req: Request) {
    const user = req.user as User;
    res.cookie('username', user.username, {
      httpOnly: false,
      secure: false,
    }); // Set username in cookie
    res.redirect(`http://${process.env.IP}:3000/2fa`);
  }

  /**
   * GET /auth/status
   * Retrieve the auth status
   */
  @Get('status')
  async status(@Req() req: RequestWithUser) {
    if (!req.isAuthenticated()) {
      return false;
    }

    // For 2FA -----
    const isTwoFactorAuthOn = await this.usersService.getTwoFactorAuthState(
      req.user.uid,
    );
    if (isTwoFactorAuthOn) {
      const isTwoFactorAuthenticated =
        await this.usersService.isTwoFactorAuthenticated(req.user.uid);
      if (!isTwoFactorAuthenticated) {
        return false;
      }
    }
    // -------------

    return true;
  }

  /**
   * GET /auth/logout
   * Logging the user out
   */
  @Get('logout')
  async logout(
    @Req() request: RequestWithUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.isAuthenticated()) {
      res.clearCookie('connect.sid');
      res.clearCookie('username');

      res.redirect(`http://${process.env.IP}:3000/login`);
      return;
    }
    // Set 2FA authenticated to false in DB to indicate user is not connected anymore
    await this.usersService.setIsTwoFactorAuthenticated(
      request.user.uid,
      false,
    );

    // Logout session
    await new Promise<void>((resolve, reject) => {
      req.logOut((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Destroy session
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Delete cookie 'connect.sid' on client side
    res.clearCookie('connect.sid');
    res.clearCookie('username');

    // Redirect on login page
    res.redirect(`http://${process.env.IP}:3000/login`);
  }

  @Get('testlogin')
  async testLogin(@Res() res: Response, @Req() req: Request) {
    const userTest = {
      intraId: '987654',
      username: 'userTest',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      urlAvatar: '',
      intraUsername: 'userTest',
    };

    const usr = await this.authService.findUser(userTest.intraId);
    if (!usr) {
      await this.authService.createUser(userTest);
    }

    // Use passport to connect userTest
    req.logIn(userTest, (err) => {
      if (err) {
        console.error('Error logging in:', err);
        throw err;
      }

      res.cookie('username', userTest.username, {
        httpOnly: false,
        secure: false,
      });

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          throw err;
        }

        res.redirect(`http://${process.env.IP}:3000/home`);
      });
    });
  }
}
