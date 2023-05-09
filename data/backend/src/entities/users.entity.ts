import internal from 'stream';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Users' })
export class Users {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	apiToken: string

	@Column()
	intraUsername: string

	@Column()
	username: string

	@Column()
	status: number

	// Check path to file
	@Column()
	avatar: string
}