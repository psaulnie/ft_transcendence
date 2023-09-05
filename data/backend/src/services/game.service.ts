import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

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
	// spectators: User[],
}

const rectWidth = 5;
const rectHeight = 75;
const ballWidth = 10;
const paddleSpeed = 10;
const maxScore = 5;

@Injectable()
export class GameService {
	
	
	private gameRooms: gameRoom[];
	
	constructor() {
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
			ballPos: {x: 310, y: 202},
			ballSpeedX: 1,
			ballSpeedY: 1,
			// spectator: [],
		});
		this.resetBall(gameRoomId);
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

		if (this.gameRooms[roomIndex].ballPos.x < rectWidth + 20 &&
			this.gameRooms[roomIndex].ballPos.y + ballWidth > this.gameRooms[roomIndex].player1.Y &&
			this.gameRooms[roomIndex].ballPos.y < this.gameRooms[roomIndex].player1.Y + rectHeight) {
				this.gameRooms[roomIndex].ballSpeedX = -this.gameRooms[roomIndex].ballSpeedX;
		}

		if (this.gameRooms[roomIndex].ballPos.x > 640 - 20 - 2 * rectWidth &&
			this.gameRooms[roomIndex].ballPos.y  + ballWidth > this.gameRooms[roomIndex].player2.Y &&
			this.gameRooms[roomIndex].ballPos.y < this.gameRooms[roomIndex].player2.Y + rectHeight) {
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
		if (this.gameRooms[roomIndex].player1.score === maxScore) {
			this.resetBall(gameRoomId);
		} else if (this.gameRooms[roomIndex].player2.score === maxScore) {
			this.resetBall(gameRoomId);
		}
	}

	resetBall(gameRoomId: string) {
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
			this.gameRooms[roomIndex].ballPos.x = 310;
			this.gameRooms[roomIndex].ballPos.y = 202;
			this.gameRooms[roomIndex].ballSpeedX = -this.gameRooms[roomIndex].ballSpeedX;
			this.gameRooms[roomIndex].ballSpeedY = Math.random() * 10 - 5;
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
}
