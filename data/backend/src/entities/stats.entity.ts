import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Statistics' })
export class Statistics {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => User, user => user.uid)
	@JoinColumn({ name: 'user' })
	user: User

	@Column()
	winNbr: number

	@Column()
	loseNbr: number

	@Column()
	matchNumber: number

	@Column()
	level: number

	@Column()
	rank: number
}