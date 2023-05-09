import internal from 'stream';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Achievements' })
export class Achievements {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number

	// Need to insert all of the achievements with boolean and title
}