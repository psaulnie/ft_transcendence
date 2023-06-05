import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from '../entities/room.entity';
import { User } from '../entities/user.entity';
import { UsersList } from 'src/entities/usersList.entity';
import { Statistics } from '../entities/stats.entity';
import { MatchHistory } from '../entities/matchHistory.entity';
import { Achievements } from '../entities/achievements.entity';

import { ChatController } from './chat.controller';
import { RoomService } from './room.service';
import { UserService } from './user.service';

import { ChatGateway } from 'src/gateway/chat.gateway';
import { BlockedUsersList } from 'src/entities/blockedUsersList';

@Module({
	imports: [TypeOrmModule.forFeature([
		Room,
		User,
		UsersList,
		BlockedUsersList,
		Statistics,
		MatchHistory,
		Achievements])],
	controllers: [ChatController],
	providers: [RoomService, UserService, ChatGateway],
})
export class ChatModule {}
