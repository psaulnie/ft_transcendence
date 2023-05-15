import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: 'RoomsList' })
export class RoomsList {
	@PrimaryColumn()
	RoomId: number
}