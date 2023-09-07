import {
  Controller,
  Get,
  HttpException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users/users.service';
import { AuthenticatedGuard } from './auth/guards/intraAuthGuard.service';
import RequestWithUser from './auth/service/requestWithUser.interface';
import { User } from './entities';

@Controller('/api/profile')
export class ProfileController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:username')
  @UseGuards(AuthenticatedGuard)
  async getUserProfile(@Param('username') username: string) {
    if (!username) throw new HttpException('No username provided', 400);
    const user = await this.userService.findOneProfile(username);
    if (!user) return { exist: false };
    const matchHistory = [];
    const iteration = user.matchHistory.length < 10 ? matchHistory.length : 10;

    for (let index = 0; index < iteration; index++) {
      // TODO test when game is finished
      matchHistory.push({
        p1: user.matchHistory[index].user1.username,
        p2: user.matchHistory[index].user2.username,
        scoreP1: user.matchHistory[index].user1Score,
        scoreP2: user.matchHistory[index].user2Score,
      });
    }
    return {
      exist: true,
      username: user.username,
      rank: user.statistics.rank,
      wins: user.statistics.winNbr,
      loses: user.statistics.loseNbr,
      matchHistory: matchHistory,
    };
  }

  @Get('/:username/achievements')
  @UseGuards(AuthenticatedGuard)
  async getUserAchievements(@Param('username') username: string) {
    if (!username) throw new HttpException('No username provided', 400);
    const user = await this.userService.findOneAchievements(username);
    if (!user) return { exist: false };
    return {
      exist: true,
      achievements: user.achievements,
    };
  }

  @Get('/user/rank')
  @UseGuards(AuthenticatedGuard)
  async getUserRank(
    @Req() req: RequestWithUser,
  ) {
    const user = req.user as User;
    const cUser = await this.userService.findOne(user.username);
    if (!user || !cUser) throw new HttpException('Unprocessable entity', 422);
    return cUser.statistics.rank;
  }
}
