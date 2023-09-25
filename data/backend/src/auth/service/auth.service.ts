import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { UserDetails } from '../../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Statistics } from 'src/entities/stats.entity';
import { Achievements } from 'src/entities/achievements.entity';
import { randomUUID } from 'crypto';

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
    const { intraId, accessToken, refreshToken } = details;
    const user = await this.userRepo.findOneBy({ intraId });
    if (user) {
      if (user.urlAvatar === '' || user.urlAvatar === null) {
        const url: any = await firstValueFrom(
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
        details.urlAvatar = url?.data?.image?.link;
        if (!details.urlAvatar) details.urlAvatar = '';
      }
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await this.userRepo.update(user.uid, {
        accessToken,
        refreshToken,
      }); //Update accessToken
      console.log('‣ User after update : ', user);
      return user;
    }
    return this.createUser(details);
  }

  async createUser(details: UserDetails) {
    // TODO remove condition, it's only for userTest
    if (details.username !== 'userTest') {
      const url: any = await firstValueFrom(
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
      details.urlAvatar = url?.data?.image?.link;
      if (!details.urlAvatar) details.urlAvatar = '';
    }

    const achievements = new Achievements();
    const statistics = new Statistics();

    while (
      await this.userRepo.findOne({ where: { username: details.username } })
    ) {
      details.username = randomUUID().slice(0, 8);
    }
    const user = this.userRepo.create(details);
    user.achievements = achievements;
    user.statistics = statistics;
    await this.achievementsRepo.save(achievements);
    await this.statsRepo.save(statistics);
    return this.userRepo.save(user);
  }

  findUser(intraId: string): Promise<User> | undefined {
    return this.userRepo.findOneBy({ intraId });
  }
}
