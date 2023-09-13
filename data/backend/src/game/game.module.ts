import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { GameService } from 'src/services/game.service';
import { Gateway } from 'src/gateway/gateway';
import { RoomService } from 'src/services/room.service';
import { UsersStatusService } from 'src/services/users.status.service';
import { Statistics } from 'src/entities/stats.entity';
import { MatchHistory } from 'src/entities/matchHistory.entity';
import { AppModule } from 'src/app.module';
import { Achievements } from 'src/entities/achievements.entity';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  providers: [
    GameService,
    UsersStatusService,
    User,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  imports: [
    TypeOrmModule.forFeature([User, BlockedList, Statistics, MatchHistory, Achievements]),
    HttpModule.register({}),
    forwardRef(() => AppModule),
  ],
})
export class GameModule {}
