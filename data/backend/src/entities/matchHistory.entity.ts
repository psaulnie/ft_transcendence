import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'MatchHistory' })
export class MatchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.uid)
  @JoinColumn({ name: 'user1' })
  user1: User;

  @OneToMany(() => User, (user) => user.uid)
  @JoinColumn({ name: 'user2' })
  user2: User;

  @Column()
  uid1Score: number;

  @Column()
  uid2Score: number;
}
