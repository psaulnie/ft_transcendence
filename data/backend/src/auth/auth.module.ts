import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { IntraStrategy } from './strategies/intra-auth.strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormSession, User } from '../entities';
import { SessionSerializer } from './session/Serializer';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { FriendList } from 'src/entities/friend.list.entity';
import { Statistics } from 'src/entities/stats.entity';
import { MatchHistory } from 'src/entities/matchHistory.entity';
import { Achievements } from 'src/entities/achievements.entity';

@Module({
  controllers: [AuthController],
  providers: [
    IntraStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    UsersService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, BlockedList, FriendList, Statistics, Achievements, MatchHistory, TypeormSession]),
    HttpModule.register({}),
  ],
})
export class AuthModule {}
