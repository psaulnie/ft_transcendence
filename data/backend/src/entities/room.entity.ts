import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { UsersList } from './usersList.entity';

@Entity({ name: 'Room' })
export class Room {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	password: string

	@Column()
	ownerID: number

	@Column(() => UsersList)
	usersID: UsersList

	@Column(() => UsersList)
	adminsID: UsersList

	@Column(() => UsersList)
	blockedUsersID: UsersList

}