import {
	Controller,
	Get,
	Param,
  } from '@nestjs/common';
  import { HttpException } from '@nestjs/common';
  
  import { UsersService } from './users/users.service';
  
  import { AuthenticatedGuard } from './auth/guards/intra-auth.guards';
  import { UseGuards } from '@nestjs/common';
  
  @Controller('/api/profile')
  export class ProfileController {
	constructor(
	  private readonly userService: UsersService,
	) {}
  
	@Get('/:username')
	@UseGuards(AuthenticatedGuard)
	async getUserProfile(@Param('username') username: string) {
		if (!username) throw new HttpException('No username provided', 400);
		const user = await this.userService.findOneProfile(username);
		if (!user) return ({ exist: false });
		const matchHistory = [];
		let iteration = user.matchHistory.length < 10 ? matchHistory.length : 10;

		for (let index = 0; index < iteration; index++) { // TODO test when game is finished
			matchHistory.push({
				p1: user.matchHistory[index].user1.username,
				p2: user.matchHistory[index].user2.username,
				scoreP1: user.matchHistory[index].user1Score,
				scoreP2: user.matchHistory[index].user2Score,
			});
		}
		const userProfile = {
			exist: true,
			username: user.username,
			rank: user.statistics.rank,
			wins: user.statistics.winNbr,
			loses: user.statistics.loseNbr,
			matchHistory: matchHistory
		}

		return userProfile;
	}

	@Get('/:username/achievements')
	@UseGuards(AuthenticatedGuard)
	async getUserAchievements(@Param('username') username: string) {
		if (!username) throw new HttpException('No username provided', 400);
		const user = await this.userService.findOneAchievements(username);
		if (!user) return ({ exist: false });
		const achievements = {
			exist: true,
			achievements: user.achievements
		}

		return achievements;
	}
}