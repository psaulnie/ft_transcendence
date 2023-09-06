import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { GameService } from 'src/services/game.service';
import { Gateway } from 'src/gateway/gateway';
import { RoomService } from 'src/services/room.service';
import { UsersStatusService } from 'src/services/users.status.service';

@Module({
  providers: [
    GameService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, BlockedList]),
    HttpModule.register({}),
  ],
})
export class GameModule {}
