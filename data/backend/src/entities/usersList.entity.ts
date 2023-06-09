import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Room } from "./room.entity";

@Entity({ name: 'UsersList' })
export class UsersList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number

	@ManyToOne(() => Room, room => room.usersID, { onDelete: 'CASCADE' })
	@JoinColumn()
	room: Room

	@ManyToOne(() => Room, room => room.adminsID, { onDelete: 'CASCADE' })
	@JoinColumn()
	adminRoom: Room

	@ManyToOne(() => Room, room => room.blockedUsersID, { cascade: true, onDelete: 'CASCADE' })
	@JoinColumn()
	blockedRoom: Room

}