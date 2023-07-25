import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    console.log(username, pass);
    let user = await this.usersService.findOne(username);
    console.log('user: ' + user);

    if (!user) {
      user = await this.usersService.createUser(username, pass);
    }
    // TODO: hash password!
    else if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    console.log('apres else if ', user);
    const payload = { sub: user.id, username: user.username };
    console.log('payload ', payload);
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async logIn(username: string, pass: string) {
    // const payload = { username: user.username, sub: user.userId }; //find() si utilisateur existe puis hasher mdp et le comparer avec celui en db
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
  }

  async intraLogIn(): Promise<any> {
    const user = await fetch('https://api.intra.42.fr/oauth/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('intra user: ' + user);

    const payload = { sub: user, username: 'example' };
    console.log('payload2 ', payload);

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }
}
