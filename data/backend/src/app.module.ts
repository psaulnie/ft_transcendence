import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserService } from './services/user.service';

import { User } from './entities/user.entity';

import { ChatController } from './chatModule/chat.controller';
import { RoomService } from './services/room.service';
import { Room } from './entities/room.entity';
import { Achievements } from './entities/achievements.entity';
import { MatchHistory } from './entities/matchHistory.entity';
import { Password } from './entities/password.entity';
import { Stats } from 'fs';
import { UsersList } from './entities/usersList.entity';
import { Gateway } from './gateway/gateway';

@Module({
  imports: [
	ConfigModule.forRoot(),
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'database',
		port: 5432,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		logging: false,
		synchronize: true,
		autoLoadEntities: true,
	}),
	TypeOrmModule.forFeature([
		User,
		Room,
		Achievements,
		MatchHistory,
		Password,
		Stats,
		UsersList
	]),
	CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController, ChatController],
  providers: [UserService, AppService, RoomService, Gateway],
})
export class AppModule {}
