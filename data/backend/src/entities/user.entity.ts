import {
  	Entity,
  	Column,
  	PrimaryGeneratedColumn,
  	AfterLoad,
	ManyToMany,
	JoinTable
} from 'typeorm';
import { UsersList } from './usersList.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clientId: string;

  // @Column()
  // intraUsername: string;

  @Column({ name: 'username' })
  username: string;

  // @Column() // No password for the moment
  // password: string;

  // @Column()
  // status: number;

  // Check path to file
  @Column({ nullable: true })
  urlAvatar: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @ManyToMany(() => User, blockedUsers => blockedUsers.blockedUsers)
  @JoinTable()
  blockedUsers: User[];

  @AfterLoad()
  async nullCheck() {
	  if (!this.blockedUsers)
		  this.blockedUsers = [];
	}
}
