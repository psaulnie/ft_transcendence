import { Injectable } from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { UserDetails } from '../../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService implements AuthProvider {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly httpService: HttpService,
  ) {}
  async validateUser(details: UserDetails) {
    const { intraId, accessToken, refreshToken } = details;
    console.log('details in validateUser : ', details);
    const user = await this.userRepo.findOneBy({ intraId });
    console.log('Found user in db', user);
    console.log('-----');
    if (user) {
      if (user.urlAvatar === '' || user.urlAvatar === null) {
        const url = await firstValueFrom(
          this.httpService
            .get('https://api.intra.42.fr/v2/me', {
              headers: {
                Authorization: `Bearer ${details.accessToken}`,
              },
            })
            .pipe(
              catchError((error: any) => {
                throw new UnauthorizedException();
              }),
            ),
        );
        user.urlAvatar = url.data.image.versions.small;
      }
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await this.userRepo.save(user); //Update accessToken
      console.log('user after update : ', user);
      return user;
    }
    return this.createUser(details);
  }

  async createUser(details: UserDetails) {
    console.log('Creating User');
    console.log(details);
    console.log('-----');

    const user = this.userRepo.create(details);
    return this.userRepo.save(user);
  }

  findUser(intraId: string): Promise<User> | undefined {
    return this.userRepo.findOneBy({ intraId });
  }
}
