import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterLoad, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
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

	@Column({name: 'username'})
	username: string

	@Column()
	status: number

	// Check path to file
	@Column()
	avatar: string

	@ManyToMany(() => User, blockedUsers => blockedUsers.blockedUsers)
	@JoinTable()
	blockedUsers: User[]

	@AfterLoad()
	async nullCheck() {
		if (!this.blockedUsers)
			this.blockedUsers = [];
	}
}