import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// TODO maybe not needed
@Entity({ name: 'RoomsList' })
export class RoomsList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	roomId: number
}