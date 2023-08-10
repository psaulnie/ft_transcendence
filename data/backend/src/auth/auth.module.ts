import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { IntraStrategy } from './strategies/intra-auth.strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { SessionSerializer } from './session/Serializer';

@Module({
  controllers: [AuthController],
  providers: [
    IntraStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
