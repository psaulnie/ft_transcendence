import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad } from "typeorm";

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

	@OneToMany(() => UsersList, usersList => usersList.userId)
	usersID: UsersList[]
	// @Column(() => UsersList)

	@OneToMany(() => UsersList, usersList => usersList.userId)
	adminsID: UsersList[]

	@OneToMany(() => UsersList, usersList => usersList.userId)
	blockedUsersID: UsersList[]

	@AfterLoad()
	async nullCheck() {
		if (!this.usersID)
			this.usersID = [];
		if (!this.adminsID)
			this.adminsID = [];
		if (!this.blockedUsersID)
			this.adminsID = [];
	}

}