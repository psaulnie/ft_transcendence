import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
//modifier interface pour les players

export interface Player {
	name: string,
	user: User,
	direction: number,
}

export interface gameRoom {
	gameRoomId: string,
	player1: Player,
	player2: Player,
	player1Score: number,
	player2Score: number,
	ballPos: {x: number, y: number},
	paddle1Pos: {x: number, y: number},
	paddle2Pos: {x: number, y: number},
	// direction: number,
	// spectators: User[],
}
@Injectable()
export class GameService {

	private gameRooms: gameRoom[];
	private player: Player;

  constructor(
    @InjectRepository(User)
	private userService: UsersService,
    private userRepository: Repository<User>,
  ) {
	this.gameRooms = [];
  }
  // TODO send gameId to frontend & generate an id
	// newGame(User1: User, User2: User): string {
	newGame(player1: User, player2: User, name1: string, name2: string): string {
		const gameRoomId = randomUUID();
		this.gameRooms.push({
			gameRoomId: gameRoomId,			
			player1: {
				name: name1,
				user: player1,
				direction: 0, 
			},
			player2: {
				name: name2,
				user: player2,
				direction: 0,
			},
			player1Score: 0,
			player2Score: 0,
			ballPos: {x: 320, y: 212}, // TODO edit
			paddle1Pos: {x: 20, y: 212}, // TODO edit
			paddle2Pos: {x: 620, y: 212}, // TODO edit
			// direction: 0, // TODO edit
			// spectator: [],
		});
		return (gameRoomId);
	}
}
