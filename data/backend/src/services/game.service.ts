import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

export interface Player {
	// name: string,
	user: User,
	direction: number,
	Y: number,
	P1: boolean,
}

export interface gameRoom {
	gameRoomId: string,
	player1: Player,
	player2: Player,
	player1Score: number,
	player2Score: number,
	ballPos: {x: number, y: number},
	// spectators: User[],
}

const rectWidth = 5;
const rectHeight = 75;

@Injectable()
export class GameService {
	

	private gameRooms: gameRoom[];
	private player: Player;

  constructor() {
	this.gameRooms = [];
  }
  
	newGame(player1: User, player2: User): string {
		const gameRoomId = randomUUID();
		this.gameRooms.push({
			gameRoomId: gameRoomId,			
			player1: {
				user: player1.username < player2.username ? player1 : player2,
				direction: 0,
				Y: 175,
				P1: true,
			},
			player2: {
				user: player1.username > player2.username ? player1 : player2,
				direction: 0,
				Y: 175,
				P1: false,
			},
			player1Score: 0,
			player2Score: 0,
			ballPos: {x: 320, y: 212}, // TODO edit
			// spectator: [],
		});
		console.log(this.gameRooms);
		return (gameRoomId);
	}

	movePlayer(gameRoomId: string) {
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		// console.log("MOVEPLAYER");
		const speed = 10;
		// console.log("ca vas bouger");
		// console.log(gameRoom);
		// console.log(this.gameRoom ? true : false, this.gameRoom.player1 ? true : false, this.gameRoom.player1.direction);
		if (this.gameRooms[roomIndex] && this.gameRooms[roomIndex].player1 && this.gameRooms[roomIndex].player1.direction !== 0) {
		  if (this.gameRooms[roomIndex].player1.direction === 1)
			this.gameRooms[roomIndex].player1.Y = this.gameRooms[roomIndex].player1.Y - speed > 0 ? this.gameRooms[roomIndex].player1.Y - speed : 0;
		  if (this.gameRooms[roomIndex].player1.direction === -1) {
		  	this.gameRooms[roomIndex].player1.Y = this.gameRooms[roomIndex].player1.Y + rectHeight + speed < 425 ? this.gameRooms[roomIndex].player1.Y + speed : 350;
		}
		console.log("p1: ", this.gameRooms[roomIndex].player1.Y);
		}
		else if (this.gameRooms[roomIndex] && this.gameRooms[roomIndex].player2 && this.gameRooms[roomIndex].player2.direction !== 0) {
		  if (this.gameRooms[roomIndex].player2.direction === 1)
		  	this.gameRooms[roomIndex].player2.Y = this.gameRooms[roomIndex].player2.Y - speed > 0 ? this.gameRooms[roomIndex].player2.Y - speed : 0;
		  if (this.gameRooms[roomIndex].player2.direction === -1)
		  	this.gameRooms[roomIndex].player2.Y = this.gameRooms[roomIndex].player2.Y + rectHeight + speed < 425 ? this.gameRooms[roomIndex].player2.Y + speed : 350;
		}
		console.log("p2: ", this.gameRooms[roomIndex].player2.Y);
	}

	pressUp(player: string, gameRoomId: string)
	{
		// console.log("press UP");
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		if (player === this.gameRooms[roomIndex].player1.user.username) {
		this.gameRooms[roomIndex].player1.direction = 1;
		}
		else {
		this.gameRooms[roomIndex].player2.direction = 1;
		}
	}

	pressDown(player: string, gameRoomId: string)
	{
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		// console.log("press Down");
		if (player === this.gameRooms[roomIndex].player1.user.username) {
		this.gameRooms[roomIndex].player1.direction = -1;
		}
		else {
		this.gameRooms[roomIndex].player2.direction = -1;
		}
	}

	releaseUp(player: string, gameRoomId: string)
	{
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		// console.log("release KEY");
		if (player === this.gameRooms[roomIndex].player1.user.username) {
		this.gameRooms[roomIndex].player1.direction = 0;
		}
		else {
		this.gameRooms[roomIndex].player2.direction = 0;
		}
	}

	releaseDown(player: string, gameRoomId: string)
	{
		const roomIndex = this.gameRooms.findIndex((obj) => obj.gameRoomId === gameRoomId);
		if (roomIndex === -1)
			return ;
		// console.log("release KEY");
		if (player === this.gameRooms[roomIndex].player1.user.username) {
		this.gameRooms[roomIndex].player1.direction = 0;
		}
		else {
		this.gameRooms[roomIndex].player2.direction = 0;
		}
	}

	getGameRoom(index: string): gameRoom {
		const room = this.gameRooms.find((obj) => obj.gameRoomId === index);
		if (!room)
			return ;
		return (room);
	}
}
