import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RoomsList } from './roomsList.entity';

@Entity({ name: 'User' })
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	isConnected: boolean
	
	@Column()
	apiToken: string

	@Column()
	intraUsername: string

	@Column({name: 'username'})
	username: string

	@Column()
	status: number

	// Check path to file
	@Column()
	avatar: string

	@Column(() => RoomsList)
	connectedRooms: RoomsList
}