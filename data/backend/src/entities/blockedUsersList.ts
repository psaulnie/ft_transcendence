import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'BlockedUsersList' })
export class BlockedUsersList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number

	@ManyToOne(() => User, user => user.blockedUsersID, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User
}