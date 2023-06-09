import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad, JoinColumn } from "typeorm";

import { UsersList } from './usersList.entity';

@Entity({ name: 'Room' })
export class Room {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	roomName: string

	@Column()
	access: number

	@Column()
	password: string

	@Column()
	ownerID: number

	@Column()
	usersNumber: number

	@OneToMany(() => UsersList, usersList => usersList.room)
	usersID: UsersList[]

	@OneToMany(() => UsersList, usersList => usersList.adminRoom)
	adminsID: UsersList[]

	@OneToMany(() => UsersList, usersList => usersList.blockedRoom)
	blockedUsersID: UsersList[]

	@AfterLoad()
	async nullCheck() {
		if (!this.usersID)
			this.usersID = [];
		if (!this.adminsID)
			this.adminsID = [];
		if (!this.blockedUsersID)
			this.blockedUsersID = [];
	}

}