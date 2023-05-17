import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { UsersList } from './usersList.entity';

@Entity({ name: 'Room' })
export class Room {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	roomName: string

	@Column()
	password: string

	@Column()
	ownerID: number

	@Column()
	usersNumber: number

	// @OneToMany(() => UsersList, usersList => usersList.userId)
	// usersID: UsersList[]
	// // @Column(() => UsersList)

	// @OneToMany(() => UsersList, usersList => usersList.userId)
	// adminsID: UsersList

	// @OneToMany(() => UsersList, usersList => usersList.userId)
	// blockedUsersID: UsersList

}