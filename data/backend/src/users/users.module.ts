import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from '../entities/room.entity';
import { User } from '../entities';
import { UsersList } from 'src/entities/usersList.entity';
import { RoomsList } from 'src/entities/roomsList.entity';
import { Statistics } from '../entities/stats.entity';
import { MatchHistory } from '../entities/matchHistory.entity';
import { Achievements } from '../entities/achievements.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Room,
      User,
      UsersList,
      RoomsList,
      Statistics,
      MatchHistory,
      Achievements,
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
