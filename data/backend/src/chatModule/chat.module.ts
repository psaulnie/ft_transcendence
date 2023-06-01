import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from '../entities/room.entity';
import { User } from '../entities/user.entity';
import { UsersList } from 'src/entities/usersList.entity';
import { RoomsList } from 'src/entities/roomsList.entity';
import { Statistics } from '../entities/stats.entity';
import { MatchHistory } from '../entities/matchHistory.entity';
import { Achievements } from '../entities/achievements.entity';

import { ChatController } from './chat.controller';
import { RoomService } from './room.service';
import { UsersService } from '../users/users.service';

import { ChatGateway } from 'src/gateway/chat.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([
		Room,
		User,
		UsersList,
		RoomsList,
		Statistics,
		MatchHistory,
		Achievements])],
	controllers: [ChatController],
	providers: [RoomService, UsersService, ChatGateway],
})
export class ChatModule { }
