import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity({ name: 'RoomsList' })
export class RoomsList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	roomId: number
}