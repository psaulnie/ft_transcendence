import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterLoad,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { BlockedList } from './blocked.list.entity';
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

  @Column({ default: 'canvas'})
  gameBackground: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ default: false })
  twoFactorAuthState: boolean;

  @Column({ nullable: true })
  twoFactorAuthSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthEnabled: boolean;

  @Column({ default: false })
  isTwoFactorAuthenticated: boolean;

  @OneToMany(() => BlockedList, (user) => user.user)
  blockedUsers: BlockedList[];

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

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
  }
}
