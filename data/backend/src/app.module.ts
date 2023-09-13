import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './services/app.service';

import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { TypeormSession, entities } from './entities';

import { User } from './entities';

import { ChatController } from './chatModule/chat.controller';
import { RoomService } from './services/room.service';
import { Room } from './entities/room.entity';
import { Achievements } from './entities/achievements.entity';
import { MatchHistory } from './entities/matchHistory.entity';
import { UsersList } from './entities/usersList.entity';
import { Gateway } from './gateway/gateway';
import { UsersService } from './users/users.service';

import { SessionSerializer } from './auth/session/Serializer';
import { IntraStrategy } from './auth/strategies/intraAuth.strategy';
import { AuthService } from './auth/service/auth.service';
import { HttpModule } from '@nestjs/axios';
import { UsersStatusService } from './services/users.status.service';
import { BlockedList } from './entities/blocked.list.entity';
import { Statistics } from './entities/stats.entity';
import { GameModule } from './game/game.module';
import { GameService } from './services/game.service';
import { ProfileController } from './controllers/profile.controller';
import { FriendListController } from './controllers/friendlist.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 2000,
      limit: 10,
    }]),
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
    TypeOrmModule.forFeature([
      User,
      Room,
      Achievements,
      MatchHistory,
      Statistics,
      BlockedList,
      UsersList,
      TypeormSession,
    ]),
    CacheModule.register({ isGlobal: true }),
    HttpModule.register({}),
    forwardRef(() => GameModule),
  ],
  controllers: [
    AppController,
    ChatController,
    ProfileController,
    FriendListController,
  ],
  providers: [
    UsersService,
    GameService,
    UsersStatusService,
    AppService,
    RoomService,
    Gateway,
    IntraStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  exports: [UsersStatusService],
})
export class AppModule {}
