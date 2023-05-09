import internal from 'stream';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'MatchHistory' })
export class MatchHistory {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number

	@Column()
	opponentId: number

	@Column()
	winnerId: number
}