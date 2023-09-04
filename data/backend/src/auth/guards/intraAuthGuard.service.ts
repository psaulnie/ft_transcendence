import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntraAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext) {
    try {
      console.log('INTRA AUTH GUARD');
      const activate = (await super.canActivate(context)) as boolean;
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
      return activate;
    } catch (error) {
      const response = context.switchToHttp().getResponse();
      response.redirect(`http://${process.env.IP}:3000/?login-refused=true`);
      return false;
    }
  }
}

/**
 * Send connect.id (session cookie) in header of your request to use this guard.
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AUTHENTICATED GUARD');
    const req = context.switchToHttp().getRequest();
    console.log('‣ Session:', req.session);
    console.log('‣ Cookies received:', req.cookies);
    console.log('‣ isAuthenticated: ', req.isAuthenticated());
    // TODO REMOVE -------
    const [type, token] = req.headers['authorization']?.split(' ') ?? [];
    if (type && type === 'Bearer' && token && token === 'test') {
      return true;
    }
    return req.isAuthenticated();
  }
}
