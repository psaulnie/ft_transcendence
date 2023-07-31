import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ChatModule } from './chatModule/chat.module';
import { GameModule } from './gameModule/game.module';

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
	GameModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
