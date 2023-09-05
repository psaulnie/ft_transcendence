import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { IntraStrategy } from './strategies/intra-auth.strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormSession, User } from '../entities';
import { SessionSerializer } from './session/Serializer';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { FriendList } from 'src/entities/friend.list.entity';

@Module({
  controllers: [AuthController],
  providers: [
    IntraStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    UsersService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, BlockedList, FriendList, TypeormSession]),
    HttpModule.register({}),
  ],
})
export class AuthModule {}
