import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'UsersList' })
export class UsersList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userId: number
}