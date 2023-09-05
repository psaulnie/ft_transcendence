import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Statistics' })
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 0})
  winNbr: number;

  @Column({default: 0})
  loseNbr: number;

  @Column({default: 0})
  matchNumber: number;

  @Column({default: 1})
  level: number;

  @Column({default: 0})
  rank: number;
}
