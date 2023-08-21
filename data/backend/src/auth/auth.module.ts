import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { IntraStrategy } from './strategies/intra-auth.strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { SessionSerializer } from './session/Serializer';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';

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
  imports: [TypeOrmModule.forFeature([User]), HttpModule.register({})],
})
export class AuthModule {}
