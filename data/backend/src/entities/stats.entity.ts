import internal from 'stream';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Statistics' })
export class Statistics {
	@PrimaryColumn()
	userId: number

	@Column()
	winNbr: number

	@Column()
	loseNbr: number

	@Column()
	ladder: number

}