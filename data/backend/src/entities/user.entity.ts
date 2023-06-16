import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterLoad, JoinColumn } from 'typeorm';
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

	@OneToMany(() => BlockedUsersList, blockedUsersID => blockedUsersID.user)
	@JoinColumn()
	blockedUsersID: BlockedUsersList[]

	@AfterLoad()
	async nullCheck() {
		if (!this.blockedUsersID)
			this.blockedUsersID = [];
	}
}