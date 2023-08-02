import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterLoad,
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
  avatar: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @OneToMany(() => UsersList, (usersList) => usersList.room, { cascade: true })
  blockedUsersID: UsersList[];

  @AfterLoad()
  async nullCheck() {
    if (!this.blockedUsersID) this.blockedUsersID = [];
  }
}
