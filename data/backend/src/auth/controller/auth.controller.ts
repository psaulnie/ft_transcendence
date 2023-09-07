import { Controller, Get, Req, Res, UseGuards, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AuthenticatedGuard,
  IntraAuthGuard,
} from '../guards/intraAuthGuard.service';
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
    console.log('‣ accessToken : ', user.accessToken);
    res.cookie('accessToken', user.accessToken, {
      httpOnly: false,
      secure: false,
      // sameSite: 'none'
    }); // Set accessToken in cookie
    res.cookie('username', user.username, {
      httpOnly: false,
      secure: false,
      // sameSite: 'none'
    }); // Set username in cookie
    res.redirect(`http://${process.env.IP}:3000/2fa`);
    // res.sendStatus(200);
  }

  /**
   * GET /auth/status
   * Retrieve the auth status
   */
  @Get('status')
  status(@Req() req: Request) {
    return req.isAuthenticated();
  }

  /**
   * GET /auth/logout
   * Logging the user out
   */
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(
    @Req() request: RequestWithUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('LOGOUT CONTROLLER');

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
    res.clearCookie('accessToken');

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
    console.log(usr);
    if (!usr) {
      await this.authService.createUser(userTest);
    }

    // Use passport to connect userTest
    req.logIn(userTest, (err) => {
      if (err) {
        console.error('Error logging in:', err);
        throw err;
      }

      console.log('ICI');
      res.cookie('accessToken', userTest.accessToken, {
        httpOnly: false,
        secure: false,
      });
      res.cookie('username', userTest.username, {
        httpOnly: false,
        secure: false,
      });
      console.log('LA');

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
