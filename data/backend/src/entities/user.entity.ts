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

  @OneToMany(() => FriendList, friendList => friendList.uid1)
  friendList: FriendList[];

  @ManyToOne(() => MatchHistory, matchHistory => matchHistory.id, { nullable: true })
  matchHistory: MatchHistory;

  @OneToOne(() => Statistics, statistics => statistics.uid, { nullable: true })
  @JoinColumn({ name: 'statistics_uid', referencedColumnName: 'uid' })
  statistics: Statistics;

  @OneToOne(() => Achievements, achievements => achievements.uid, { nullable: true })
  @JoinColumn({ name: 'achievements_uid', referencedColumnName: 'uid' })
  achievements: Achievements;

  @AfterLoad()
  async nullCheck() {
    if (!this.blockedUsers) this.blockedUsers = [];
    if (!this.friendList) this.friendList = [];
  }
}
