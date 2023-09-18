import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { Statistics } from 'src/entities/stats.entity';
import { MatchHistory } from 'src/entities/matchHistory.entity';
import { UsersStatusService } from './users.status.service';
import { userStatus } from 'src/users/userStatus';
import { Achievements } from 'src/entities/achievements.entity';

export interface Player {
	user: User,
	dirUp: boolean,
	dirDown: boolean,
	Y: number,
	P1: boolean,
	score: number,
}

export interface gameRoom {
	gameRoomId: string,
	player1: Player,
	player2: Player,
	ballPos: {x: number, y: number},
	ballSpeedX: number,
	ballSpeedY: number,
	coward: string,
	intervalId: any,
}

const rectWidth = 5;
const rectHeight = 75;
const ballWidth = 10;
const paddleSpeed = 10;
const maxScore = 5;
const demote = 2;
const promote = 2;

@Injectable()
export class GameService {
	
	
	private gameRooms: gameRoom[];
	
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Statistics)
		private statsRepository: Repository<Statistics>,
		@InjectRepository(MatchHistory)
		private matchHistoryRepository: Repository<MatchHistory>,
		@InjectRepository(Achievements)
		private AchievementsRepository: Repository<Achievements>,
		@Inject(UsersStatusService)
		private usersStatusService: UsersStatusService
	) {
		this.gameRooms = [];
	}
	
	newGame(player1: User, player2: User): string {
		const gameRoomId = randomUUID();
		this.gameRooms.push({
			gameRoomId: gameRoomId,			
			player1: {
				user: player1.username < player2.username ? player1 : player2,
				dirUp: false,
				dirDown: false,
				Y: 175,
				P1: true,
				score: 0,
			},
			player2: {
				user: player1.username > player2.username ? player1 : player2,
				dirUp: false,
				dirDown: false,
				Y: 175,
				P1: false,
				score: 0,
			},
			ballPos: {x: 310, y: 212},
			ballSpeedX: 5,
			ballSpeedY: 5,
			coward: null,
			intervalId: -1,
		});
		this.resetBall(gameRoomId);
		console.log(this.gameRooms);
		return (gameRoomId);
	}

	movePlayer(gameRoomId: string) {
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		if (this.gameRooms[roomIndex] && this.gameRooms[roomIndex].player1 && this.gameRooms[roomIndex].player1.dirUp !== false || this.gameRooms[roomIndex].player1.dirDown !== false) {
		  if (this.gameRooms[roomIndex].player1.dirUp === true && this.gameRooms[roomIndex].player1.dirDown === false)
			this.gameRooms[roomIndex].player1.Y = this.gameRooms[roomIndex].player1.Y - paddleSpeed > 0 ? this.gameRooms[roomIndex].player1.Y - paddleSpeed : 0;
		  if (this.gameRooms[roomIndex].player1.dirDown === true && this.gameRooms[roomIndex].player1.dirUp === false)
		  	this.gameRooms[roomIndex].player1.Y = this.gameRooms[roomIndex].player1.Y + rectHeight + paddleSpeed < 425 ? this.gameRooms[roomIndex].player1.Y + paddleSpeed : 350;
		}
		else if (this.gameRooms[roomIndex] && this.gameRooms[roomIndex].player2 && this.gameRooms[roomIndex].player2.dirUp !== false || this.gameRooms[roomIndex].player2.dirDown !== false) {
		  if (this.gameRooms[roomIndex].player2.dirUp === true && this.gameRooms[roomIndex].player2.dirDown === false)
		  	this.gameRooms[roomIndex].player2.Y = this.gameRooms[roomIndex].player2.Y - paddleSpeed > 0 ? this.gameRooms[roomIndex].player2.Y - paddleSpeed : 0;
		  if (this.gameRooms[roomIndex].player2.dirDown === true  && this.gameRooms[roomIndex].player2.dirUp === false)
		  	this.gameRooms[roomIndex].player2.Y = this.gameRooms[roomIndex].player2.Y + rectHeight + paddleSpeed < 425 ? this.gameRooms[roomIndex].player2.Y + paddleSpeed : 350;
		}
		this.moveBall(gameRoomId);
	}

	moveBall(gameRoomId: string) {
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		this.gameRooms[roomIndex].ballPos.x += this.gameRooms[roomIndex].ballSpeedX;
		this.gameRooms[roomIndex].ballPos.y += this.gameRooms[roomIndex].ballSpeedY;

		if (this.gameRooms[roomIndex].ballPos.y < 0 || this.gameRooms[roomIndex].ballPos.y + ballWidth > 425) {
			this.gameRooms[roomIndex].ballSpeedY = -this.gameRooms[roomIndex].ballSpeedY;
		}

		if (this.gameRooms[roomIndex].ballPos.x < rectWidth + 5 &&
			this.gameRooms[roomIndex].ballPos.y + ballWidth > this.gameRooms[roomIndex].player1.Y &&
			this.gameRooms[roomIndex].ballPos.y < this.gameRooms[roomIndex].player1.Y + rectHeight) {
				if (this.gameRooms[roomIndex].ballPos.x + (ballWidth / 2) >= 5)
					this.gameRooms[roomIndex].ballPos.x = 5 + rectWidth; //  5 is p1.x 
				this.gameRooms[roomIndex].ballSpeedX = -this.gameRooms[roomIndex].ballSpeedX;
		}

		if (this.gameRooms[roomIndex].ballPos.x > 640 - 9 - 2 * rectWidth &&
			this.gameRooms[roomIndex].ballPos.y  + ballWidth > this.gameRooms[roomIndex].player2.Y &&
			this.gameRooms[roomIndex].ballPos.y < this.gameRooms[roomIndex].player2.Y + rectHeight) {
				if (this.gameRooms[roomIndex].ballPos.x + (ballWidth / 2) <= 630 + rectWidth) 
					this.gameRooms[roomIndex].ballPos.x = 630 - rectWidth ;// 630 is p2.x
				this.gameRooms[roomIndex].ballSpeedX= -this.gameRooms[roomIndex].ballSpeedX;	
		}

		if (this.gameRooms[roomIndex].ballPos.x < 0) {
			this.gameRooms[roomIndex].player2.score++;
			this.resetBall(gameRoomId);
		} else if (this.gameRooms[roomIndex].ballPos.x > 630) {
			this.gameRooms[roomIndex].player1.score++;
			this.resetBall(gameRoomId);
		}

		//TODO add to db the match
		if (this.gameRooms[roomIndex].player1.score === maxScore || this.gameRooms[roomIndex].player2.score === maxScore) {
			this.resetBall(gameRoomId);
		}
	}

	resetBall(gameRoomId: string) {
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		this.gameRooms[roomIndex].ballPos.x = 310;
		this.gameRooms[roomIndex].ballPos.y = 212;
		this.gameRooms[roomIndex].ballSpeedX = -this.gameRooms[roomIndex].ballSpeedX;
		this.gameRooms[roomIndex].ballSpeedY = Math.random() * 2 - 1;
	}

	pressUp(player: string, gameRoomId: string)
	{
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		if (player === this.gameRooms[roomIndex].player1.user.username) {
			this.gameRooms[roomIndex].player1.dirUp = true;
		}
		else {
			this.gameRooms[roomIndex].player2.dirUp = true;
		}
	}

	pressDown(player: string, gameRoomId: string)
	{
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		if (player === this.gameRooms[roomIndex].player1.user.username) {
			this.gameRooms[roomIndex].player1.dirDown = true;
		}
		else {
			this.gameRooms[roomIndex].player2.dirDown = true;
		}
	}

	releaseUp(player: string, gameRoomId: string)
	{
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		if (player === this.gameRooms[roomIndex].player1.user.username) {
			this.gameRooms[roomIndex].player1.dirUp = false;
		}
		else {
			this.gameRooms[roomIndex].player2.dirUp = false;
		}
	}

	releaseDown(player: string, gameRoomId: string)
	{
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		if (player === this.gameRooms[roomIndex].player1.user.username) {
			this.gameRooms[roomIndex].player1.dirDown = false;
		}
		else {
			this.gameRooms[roomIndex].player2.dirDown = false;
		}
	}

	getGameRoom(index: string): gameRoom {
		const room = this.gameRooms.find((obj) => obj.gameRoomId === index);
		if (!room)
			return ;
		return (room);
	}

	async leaveGame(gameRoomId: string, coward:string) {
		const userStatusTmp = await this.usersStatusService.getUserStatus(
			coward,
		);
		userStatusTmp.gameRoomId = '';
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		console.log(roomIndex);
		if (roomIndex === -1)
			return ;
		this.gameRooms[roomIndex].coward = coward;
	}

	async updateRank(userW: User, userL: User) {
		if (userW.statistics.streak <= 15) {
			if (userW.statistics.streak < 15) {
				userW.statistics.streak++;
				if (userW.statistics.streak % 3 === 0)
					userW.statistics.rank++;
			}
			userW.statistics.winNbr++;
			userW.statistics.matchNumber++;
		}
		if (userL.statistics.streak >= 0) {
			if(userL.statistics.streak > 0) {
				if (userL.statistics.streak % 3 === 0)
					userL.statistics.rank--;
				userL.statistics.streak--;
			}
			userL.statistics.loseNbr++;
			userL.statistics.matchNumber++;
		}
		await this.statsRepository.save(userW.statistics);
		await this.userRepository.save(userW);
		await this.statsRepository.save(userL.statistics);
		await this.userRepository.save(userL);
	}

	async addMatchHistory(gameRoomId: string, userW: User, userL: User) {
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		const matchHistory = new MatchHistory();
		matchHistory.user1id = userW.uid;
		matchHistory.user2id = userL.uid;
		matchHistory.user1Score = this.gameRooms[roomIndex].player1.user.username === userW.username ? this.gameRooms[roomIndex].player1.score : this.gameRooms[roomIndex].player2.score;
		matchHistory.user2Score = this.gameRooms[roomIndex].player1.user.username === userW.username ? this.gameRooms[roomIndex].player2.score : this.gameRooms[roomIndex].player1.score;
		await this.matchHistoryRepository.save(matchHistory);
	}

	async updateAchivement(userW: User, userL: User) {
		if (userW.achievements.achievement1 === false && userW.statistics.winNbr === 1)
			userW.achievements.achievement1 = true;
		if (userW.achievements.achievement2 === false && userW.statistics.winNbr === 10)
			userW.achievements.achievement2 = true;
		if (userW.achievements.achievement4 === false && userW.statistics.matchNumber === 50)
			userW.achievements.achievement4 = true;
		if (userL.achievements.achievement4 === false && userL.statistics.matchNumber === 50)
			userL.achievements.achievement4 = true;
		await this.AchievementsRepository.save(userW.achievements);
		await this.AchievementsRepository.save(userL.achievements);
	}
}
