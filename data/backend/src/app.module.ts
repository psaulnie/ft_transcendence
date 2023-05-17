import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './userModule/user.module';
// import { RoomModule } from './roomModule/room.module';

import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { Statistics } from './entities/stats.entity';
import { MatchHistory } from './entities/matchHistory.entity';
import { Achievements } from './entities/achievements.entity';

import { ChatGateway } from './gateway/chat.gateway'

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
		logging: true,
		synchronize: true,
		entities: [
			User,
			Room,
			Statistics,
			MatchHistory,
			Achievements
		],
	}),
	UserModule,
	// RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
