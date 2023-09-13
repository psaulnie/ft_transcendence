import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { TwoFactorAuthController } from './controller/twoFactorAuth.controller';
import { AuthService } from './service/auth.service';
import { IntraStrategy } from './strategies/intraAuth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormSession, User } from '../entities';
import { SessionSerializer } from './session/Serializer';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { TwoFactorAuthService } from './service/twoFactorAuth.service';
import { ConfigService } from '@nestjs/config';
import { Statistics } from 'src/entities/stats.entity';
import { MatchHistory } from 'src/entities/matchHistory.entity';
import { Achievements } from 'src/entities/achievements.entity';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  controllers: [AuthController, TwoFactorAuthController],
  providers: [
    IntraStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    UsersService,
    TwoFactorAuthService,
    ConfigService,
    AuthService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      User,
      BlockedList,
      Statistics,
      Achievements,
      MatchHistory,
      TypeormSession,
    ]),
    HttpModule.register({}),
  ],
})
export class AuthModule {}
