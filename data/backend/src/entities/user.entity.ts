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
  OneToOne
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

  // @OneToMany(() => FriendList, friendList => friendList.user1)
  // friendList: FriendList[];

  @ManyToMany(() => User, user => user.friends)
  @JoinTable()
  friends: User[];

  @ManyToOne(() => MatchHistory, matchHistory => matchHistory.id, { nullable: true })
  matchHistory: MatchHistory;

  @OneToOne(() => Statistics, statistics => statistics.user, { nullable: true })
  @JoinColumn({ name: 'statistics_user', referencedColumnName: 'user' })
  statistics: Statistics;

  @OneToOne(() => Achievements, achievements => achievements.user, { nullable: true })
  @JoinColumn({ name: 'achievements_user', referencedColumnName: 'user' })
  achievements: Achievements;

  @AfterLoad()
  async nullCheck() {
    if (!this.blockedUsers) this.blockedUsers = [];
    if (!this.friends) this.friends = [];
  }
}
