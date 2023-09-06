import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterLoad,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { FriendList } from './friend.list.entity';
import { BlockedList } from './blocked.list.entity';
import { Room } from './room.entity';
import { Achievements } from './achievements.entity';
import { MatchHistory } from './matchHistory.entity';
import { Statistics } from './stats.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  intraId: string;

  @Column()
  intraUsername: string;

  @Column({ name: 'username' })
  username: string;

  @Column({ nullable: true })
  urlAvatar: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @OneToMany(() => BlockedList, (user) => user.user)
  blockedUsers: BlockedList[];

  @ManyToMany(() => User, user => user.friends)
  @JoinTable()
  friends: User[];

  @OneToMany(() => MatchHistory, (matchHistory) => matchHistory.user1)
  matchHistory: MatchHistory[];

  @OneToOne(() => Statistics)
  @JoinColumn()
  statistics: Statistics;

  @OneToOne(() => Achievements)
  @JoinColumn()
  achievements: Achievements;

  @AfterLoad()
  async nullCheck() {
    if (!this.blockedUsers) this.blockedUsers = [];
    if (!this.friends) this.friends = [];
    if (!this.matchHistory) this.matchHistory = [];
  }
}
