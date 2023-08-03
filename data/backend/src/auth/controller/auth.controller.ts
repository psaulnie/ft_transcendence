import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AuthenticatedGuard,
  IntraAuthGuards,
} from '../guards/intra-auth.guards';

@Controller('auth')
export class AuthController {
  /**
   * GET /api/auth/login
   * This is the route the user will visit to authenticate
   */
  @Get('login')
  @UseGuards(IntraAuthGuards)
  login() {
    console.log('Coucou');
    return;
  }

  /**
   * GET /api/auth/redirect
   * This is the redirect URL the OAuth2 Provider will call.
   */
  @Get('redirect')
  @UseGuards(IntraAuthGuards)
  redirect(@Res() res: Response) {
    res.sendStatus(200);
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
  logout(@Req() req: Request, res, next) {
    // TODO test
    req.logOut((err: any) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
}
