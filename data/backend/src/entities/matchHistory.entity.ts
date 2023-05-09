import internal from 'stream';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MatchHistory' })
export class MatchHistory {
	@PrimaryColumn()
	userId: number

	@Column()
	opponentId: number

	@Column()
	winnerId: number
}