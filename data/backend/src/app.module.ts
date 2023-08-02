import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserService } from './services/user.service';

import { ChatModule } from './chatModule/chat.module';
import { GameModule } from './gameModule/game.module';
import { User } from './entities/user.entity';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
	ChatModule,
	GameModule,
	TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [UserService, AppService],
})
export class AppModule {}
