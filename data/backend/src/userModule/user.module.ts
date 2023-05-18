import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { Statistics } from '../entities/stats.entity';
import { MatchHistory } from '../entities/matchHistory.entity';
import { Achievements } from '../entities/achievements.entity';

import { UserController } from './user.controller';
import { UserService } from '../chatModule/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User,
	Statistics,
	MatchHistory,
	Achievements])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}