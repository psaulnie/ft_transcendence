import internal from 'stream';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Statistics' })
export class Statistics {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number

	@Column()
	winNbr: number

	@Column()
	loseNbr: number

	@Column()
	ladder: number

}