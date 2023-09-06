import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'MatchHistory' })
export class MatchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.matchHistory)
  user1: User;

  @ManyToOne(() => User, (user) => user.uid)
  user2: User;

  @Column()
  user1Score: number;

  @Column()
  user2Score: number;
}
