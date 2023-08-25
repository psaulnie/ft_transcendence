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
  @JoinColumn({ name: 'uid1' })
  uid1: number;

  @OneToMany(() => User, (user) => user.uid)
  @JoinColumn({ name: 'uid2' })
  uid2: number;

  @Column()
  uid1Score: number;

  @Column()
  uid2Score: number;
}
