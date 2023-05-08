import internal from 'stream';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User {
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

	@Column()
	avatar: string

}