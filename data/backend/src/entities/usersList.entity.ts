import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Room } from "./room.entity";

@Entity({ name: 'UsersList' })
export class UsersList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number

	@ManyToOne(() => Room, room => room.usersID)
	@JoinColumn()
	room: Room

}