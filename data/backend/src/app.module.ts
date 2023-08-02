import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatModule } from './chatModule/chat.module';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { entities } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: Number.parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities,
      logging: false,
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    PassportModule.register({ session: true }),
    ChatModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
