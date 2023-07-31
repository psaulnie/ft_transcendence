import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from '../entities/room.entity';
import { User } from '../entities/user.entity';
import { Password } from 'src/entities/password.entity';
import { UsersList } from 'src/entities/usersList.entity';
import { Statistics } from '../entities/stats.entity';
import { MatchHistory } from '../entities/matchHistory.entity';
import { Achievements } from '../entities/achievements.entity';


import { Gateway } from 'src/gateway/gateway'
import { GameGateway } from 'src/gateway/gameGateway';

@Module({
	imports: [TypeOrmModule.forFeature([
		Room,
		User,
		Password,
		UsersList,
		Statistics,
		MatchHistory,
		Achievements])],
	controllers: [],
	providers: [GameGateway],
})
export class GameModule {}
