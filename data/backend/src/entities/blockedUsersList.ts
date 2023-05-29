import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'UsersList' })
export class UsersList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number

	@ManyToOne(() => User, user => user.blockedUsersID, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User
}