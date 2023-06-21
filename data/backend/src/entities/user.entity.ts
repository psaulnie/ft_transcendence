import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterLoad } from 'typeorm';
import { UsersList } from './usersList.entity';

@Entity({ name: 'User' })
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	clientId: string

	@Column()
	isConnected: boolean

	@Column()
	apiToken: string

	@Column()
	intraUsername: string

	@Column({ name: 'username' })
	username: string

	@Column()
	password: string

	@Column()
	status: number

	// Check path to file
	@Column()
	avatar: string

	@OneToMany(() => UsersList, usersList => usersList.room, { cascade: true })
	blockedUsersID: UsersList[]

	@AfterLoad()
	async nullCheck() {
		if (!this.blockedUsersID)
			this.blockedUsersID = [];
	}
}