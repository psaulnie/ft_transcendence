import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterLoad } from 'typeorm';
import { BlockedUsersList } from './blockedUsersList';

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

	@Column({name: 'username'})
	username: string

	@Column()
	status: number

	// Check path to file
	@Column()
	avatar: string

	@OneToMany(() => BlockedUsersList, usersList => usersList.user, { cascade: true })
	blockedUsersID: BlockedUsersList[]

	@AfterLoad()
	async nullCheck() {
		if (!this.blockedUsersID)
			this.blockedUsersID = [];
	}
}