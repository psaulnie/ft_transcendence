import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntraAuthGuards extends AuthGuard('42') {
  async canActivate(context: ExecutionContext) {
    console.log('in guards1');
    const activate = (await super.canActivate(context)) as boolean;
    console.log('in guards2', activate);
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    console.log('in guards3');
    return activate;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    return req.isAuthenticated();
  }
}
