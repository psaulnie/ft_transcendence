import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ChatModule } from './chatModule/chat.module';
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
		autoLoadEntities: true,
	}),
	ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
