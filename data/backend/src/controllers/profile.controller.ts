import {
  Controller,
  Get,
  HttpException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthenticatedGuard } from '../auth/guards/intraAuthGuard.service';
import RequestWithUser from '../auth/service/requestWithUser.interface';
import { User } from '../entities';

@Controller('/api/profile')
export class ProfileController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:username')
  @UseGuards(AuthenticatedGuard)
  async getUserProfile(@Param('username') username: string) {
    if (!username) throw new HttpException('No username provided', 400);
    const user = await this.userService.findOneProfile(username);
    if (!user) return { exist: false };
    const userMatchHistory = await this.userService.findOneMatchHistory(
      user.uid,
    );
    const matchHistory = [];
    const iteration =
      userMatchHistory.length < 15 ? userMatchHistory.length : 15;

    for (let index = iteration - 1; index >= 0; index--) {
      const user1 = await this.userService.findOneById(
        userMatchHistory[index].user1id,
      );
      const user2 = await this.userService.findOneById(
        userMatchHistory[index].user2id,
      );
      if (!user1 || !user2) continue;
      matchHistory.push({
        p1: user1.username,
        p2: user2.username,
        scoreP1: userMatchHistory[index].user1Score,
        scoreP2: userMatchHistory[index].user2Score,
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

  @Get('/user/me')
  @UseGuards(AuthenticatedGuard)
  async getMyProfile(@Req() req: RequestWithUser) {
    if (!req.user) throw new HttpException('Forbidden', 403);
    const user = await this.userService.findOneProfile(req.user.username);
    if (!user) return { exist: false };
    const userMatchHistory = await this.userService.findOneMatchHistory(
      user.uid,
    );
    const matchHistory = [];
    const iteration =
      userMatchHistory.length < 10 ? userMatchHistory.length : 10;

    for (let index = 0; index < iteration; index++) {
      const user1 = await this.userService.findOneById(
        userMatchHistory[index].user1id,
      );
      const user2 = await this.userService.findOneById(
        userMatchHistory[index].user2id,
      );
      if (!user1 || !user2) continue;
      matchHistory.push({
        p1: user1.username,
        p2: user2.username,
        scoreP1: userMatchHistory[index].user1Score,
        scoreP2: userMatchHistory[index].user2Score,
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
  async getUserRank(@Req() req: RequestWithUser) {
    const user = req.user as User;
    const cUser = await this.userService.findOneById(user.uid);
    if (!user || !cUser) throw new HttpException('Unprocessable entity', 422);
    return cUser.statistics.rank;
  }
  
  @Get('/general/leaderboard')
  @UseGuards(AuthenticatedGuard)
  async getLeaderboard() {
    const users = await this.userService.findAll();
    const bestUsers = users.sort((a, b) => {
      if (a.statistics.rank < b.statistics.rank) return 1;
      if (a.statistics.rank > b.statistics.rank) return -1;
      if (a.statistics.rank === b.statistics.rank && a.statistics.streak < b.statistics.streak) return 1;
      else if (a.statistics.rank === b.statistics.rank && a.statistics.streak > b.statistics.streak) return -1;
      return 0;
    });
    const leaderboard = [];
    if (users.length > 0)
      leaderboard.push({
        username: bestUsers[0].username,
        score: bestUsers[0].statistics.rank * 15 + bestUsers[0].statistics.streak,
      });
    if (users.length > 1)
      leaderboard.push({
        username: bestUsers[1].username,
        score: bestUsers[1].statistics.rank * 15 + bestUsers[1].statistics.streak,
      });
    if (users.length > 2)
      leaderboard.push({
        username: bestUsers[2].username,
        score: bestUsers[2].statistics.rank * 15 + bestUsers[2].statistics.streak,
      });
    return leaderboard;
  }
}
