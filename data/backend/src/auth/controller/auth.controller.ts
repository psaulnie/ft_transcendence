import {
  Controller,
  Get,
  Next,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AuthenticatedGuard,
  IntraAuthGuards,
  IsAuthGuard,
} from '../guards/intra-auth.guards';
import { User } from '../../entities';

import { HttpService as NestHttpService } from '@nestjs/axios';

import { AxiosError } from 'axios';
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
  @UseGuards(IntraAuthGuards)
  login() {
    return;
  }

  /**
   * GET /api/auth/redirect
   * This is the redirect URL the OAuth2 Provider will call.
   */
  @Get('redirect')
  @UseGuards(IntraAuthGuards)
  redirect(@Res() res: Response, @Req() req: Request) {
    const user = req.user as User;
    console.log('redirect controller, accessToken : ', user.accessToken);
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
   * Logging the user out
   */
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res: Response, @Next() next: any) {
    req.logOut((err: any) => {
      if (err) {
        return next(err);
      }
      res.redirect('http://localhost:3000/login');
    });
  }

  /**
   * GET /api/auth/connected
   * Check the access token to see if the user is connected
   */
  @Get('connected')
  async connected(@Req() req: Request) {
    try {
      let result = true;
      let [type, token] = req.headers['authorization']?.split(' ') ?? [];
      if (type !== 'Bearer') {
        token = undefined;
      }
      if (token === 'test') return true;
      if (!token) {
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
            catchError((error: any) => {
              result = false;
              throw new UnauthorizedException();
            }),
          ),
      );
      return result;
    } catch {
      return false;
    }
  }

  @Get('testlogin')
  async testlogin(@Res() res: Response, @Req() req: Request) {
    this.usersService.createUser('testUser');
    res.cookie('accessToken', 'test', {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
    }); // Set accessToken in cookie
    res.cookie('username', 'testUser', {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
    }); // Set username in cookie
    res.redirect('http://localhost:3000/home');
  }
}
