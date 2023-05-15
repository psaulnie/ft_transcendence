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

	@Column(() => UsersList)
	usersID: UsersList

	@Column(() => UsersList)
	adminsID: UsersList

	@Column(() => UsersList)
	blockedUsersID: UsersList

}