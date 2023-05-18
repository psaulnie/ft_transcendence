import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Room } from "./room.entity";

@Entity({ name: 'UsersList' })
export class UsersList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number

	@ManyToOne(() => Room, room => room.usersID)
	room: Room
}