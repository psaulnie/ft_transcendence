import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { TwoFactorAuthController } from './controller/twoFactorAuth.controller';
import { AuthService } from './service/auth.service';
import { IntraStrategy } from './strategies/intraAuth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormSession, User } from '../entities';
import { SessionSerializer } from './session/Serializer';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { TwoFactorAuthService } from './service/twoFactorAuth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController, TwoFactorAuthController],
  providers: [
    IntraStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    UsersService,
    TwoFactorAuthService,
    ConfigService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, BlockedList, TypeormSession]),
    HttpModule.register({}),
  ],
})
export class AuthModule {}
