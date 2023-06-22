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

	@OneToMany(() => UsersList, usersList => usersList.room, { eager: true })
	usersID: UsersList[]

	@AfterLoad()
	async nullCheck() {
		if (!this.usersID)
			this.usersID = [];
	}

}