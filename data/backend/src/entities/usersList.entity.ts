import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Entity({ name: 'UsersList' })
export class UsersList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	role: string

	@ManyToOne(() => User, user => user.id)
	@JoinColumn()
	user: User

	@Column()
	isBanned: boolean

	@Column()
	isMuted: boolean

	@ManyToOne(() => Room, room => room.usersID, { onDelete: 'CASCADE' })
	@JoinColumn()
	room: Room
}