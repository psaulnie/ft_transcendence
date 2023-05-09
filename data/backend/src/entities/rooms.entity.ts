import internal from 'stream';
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { UsersList } from './usersList.entity';

@Entity({ name: 'Rooms' })
export class Rooms {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	password: string

	@Column()
	ownerID: number

	@Column()
	usersID: UsersList

	@Column()
	adminsID: UsersList

	@Column()
	blockedUsersID: UsersList

}