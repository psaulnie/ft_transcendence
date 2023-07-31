import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'Password' })
export class Password {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	uid: number

	@Column()
	password: string

}