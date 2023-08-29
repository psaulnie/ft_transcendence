import {
  ExecutionContext,
  Injectable,
  CanActivate,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntraAuthGuards extends AuthGuard('42') {
  async canActivate(context: ExecutionContext) {
    try {
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

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // TODO REMOVE -------
    const [type, token] = req.headers['authorization']?.split(' ') ?? [];
    if (type && type === 'Bearer' && token && token === 'test')
    {
      return (true);
    }
    // -------------------
    console.log(req.isAuthenticated());
    return req.isAuthenticated();
  }
}
