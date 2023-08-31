import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

export interface gameRoom {
	gameRoomId: number,
	player1: User,
	player2: User,
	player1Score: number,
	player2Score: number,
	ballPos: {x: number, y: number},
	paddle1Pos: {x: number, y: number},
	paddle2Pos: {x: number, y: number},
	direction: number
}
@Injectable()
export class GameService {

	private gameRooms: gameRoom[];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
	this.gameRooms = [];
  }

	newGame(User1: User, User2: User) {
		const gameRoomId = this.gameRooms.length;
		this.gameRooms.push({
			gameRoomId: gameRoomId,
			player1: User1,
			player2: User2,
			player1Score: 0,
			player2Score: 0,
			ballPos: {x: 0, y: 0}, // TODO edit
			paddle1Pos: {x: 0, y: 0}, // TODO edit
			paddle2Pos: {x: 0, y: 0}, // TODO edit
			direction: 0 // TODO edit
		});
	}
}
