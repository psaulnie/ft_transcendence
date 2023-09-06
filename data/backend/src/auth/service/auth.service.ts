import { Injectable } from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { UserDetails } from '../../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';
import { Statistics } from 'src/entities/stats.entity';
import { Achievements } from 'src/entities/achievements.entity';

@Injectable()
export class AuthService implements AuthProvider {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Statistics) private statsRepo: Repository<Statistics>,
    @InjectRepository(Achievements)
    private achievementsRepo: Repository<Achievements>,
    private readonly httpService: HttpService,
  ) {}
  async validateUser(details: UserDetails) {
    console.log('VALIDATE USER SERVICE');
    const { intraId, accessToken, refreshToken } = details;
    const user = await this.userRepo.findOneBy({ intraId });
    console.log('‣ Found user in db', user);
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
              catchError(() => {
                throw new UnauthorizedException();
              }),
            ),
        );
        user.urlAvatar = url.data.image.versions.small;
      }
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await this.userRepo.save(user); //Update accessToken
      console.log('‣ User after update : ', user);
      return user;
    }
    return this.createUser(details);
  }

  async createUser(details: UserDetails) {
    console.log('CREATE USER SERVICE');
    console.log('‣ UserDetails', details);

    const url = await firstValueFrom(
      this.httpService
        .get('https://api.intra.42.fr/v2/me', {
          headers: {
            Authorization: `Bearer ${details.accessToken}`,
          },
        })
        .pipe(
          catchError(() => {
            throw new UnauthorizedException();
          }),
        ),
    );
    details.urlAvatar = url.data.image.versions.small;

    const achievements = new Achievements();
    const statistics = new Statistics();

    const user = this.userRepo.create(details);
    user.achievements = achievements;
    user.statistics = statistics;
    await this.achievementsRepo.save(achievements);
    await this.statsRepo.save(statistics);
    return this.userRepo.save(user);
  }

  findUser(intraId: string): Promise<User> | undefined {
    console.log('FIND USER SERVICE');
    return this.userRepo.findOneBy({ intraId });
  }
}
