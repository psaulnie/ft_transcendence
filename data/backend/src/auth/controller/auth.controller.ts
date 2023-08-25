import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AuthenticatedGuard,
  IntraAuthGuard,
} from '../guards/intra-auth-guard.service';
import { User } from '../../entities';

import { HttpService as NestHttpService } from '@nestjs/axios';

import { catchError, firstValueFrom } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: NestHttpService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * GET /api/auth/login
   * This is the route the user will visit to authenticate
   */
  @Get('login')
  @UseGuards(IntraAuthGuard)
  login() {
    console.log('LOGIN CONTROLLER');
    return;
  }

  /**
   * GET /api/auth/redirect
   * This is the redirect URL the OAuth2 Provider will call.
   */
  @Get('redirect')
  @UseGuards(IntraAuthGuard)
  redirect(@Res() res: Response, @Req() req: Request) {
    console.log('REDIRECT CONTROLLER');
    const user = req.user as User;
    console.log('‣ accessToken : ', user.accessToken);
    res.cookie('accessToken', user.accessToken, {
      httpOnly: false,
      secure: false,
    }); // Set accessToken in cookie
    res.cookie('username', user.username, {
      httpOnly: false,
      secure: false,
    }); // Set accessToken in cookie
    res.redirect('http://localhost:3000/home');
    // res.sendStatus(200);
  }

  /**
   * GET /api/auth/status
   * Retrieve the auth status
   */
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  /**
   * GET /api/auth/logout
   * Logging the user out and delete session
   */
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('LOGOUT CONTROLLER');

    await new Promise<void>((resolve, reject) => {
      req.logOut((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Delete cookie 'connect.sid' on client side
    res.clearCookie('connect.sid');

    // Redirect on login page
    res.redirect('http://localhost:3000/login');
  }

  /**
   * GET /api/auth/connected
   * Check the access token to see if the user is connected
   */
  @Get('connected')
  async connected(@Req() req: Request) {
    try {
      console.log('CONNECTED CONTROLLER');
      let result = true;
      let [type, token] = req.headers['authorization']?.split(' ') ?? [];
      if (type !== 'Bearer') {
        token = undefined;
      }
      if (token === 'test') return true;
      if (!token) {
        console.log('‣ CONNECTED CONTROLLER RETURN FALSE');
        return false;
      }

      await firstValueFrom(
        this.httpService
          .get('https://api.intra.42.fr/oauth/token/info', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            catchError(() => {
              result = false;
              throw new UnauthorizedException();
            }),
          ),
      );
      console.log('‣ CONNECTED CONTROLLER RETURN ', result);
      return result;
    } catch {
      console.log('‣ CONNECTED CONTROLLER RETURN FALSE');
      return false;
    }
  }

  @Get('testlogin')
  async testlogin(@Res() res: Response) {
    console.log('TESTLOGIN CONTROLLER');
    await this.usersService.createUser('testUser');
    res.cookie('accessToken', 'test', {
      httpOnly: false,
      secure: false,
    }); // Set accessToken in cookie
    res.cookie('username', 'testUser', {
      httpOnly: false,
      secure: false,
    }); // Set username in cookie
    res.redirect('http://localhost:3000/home');
  }
}
