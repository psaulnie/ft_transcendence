import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'MatchHistory' })
export class MatchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.matchHistory)
  @JoinColumn({name: 'user1'})
  user1: User;

  @ManyToOne(() => User, (user) => user.matchHistory)
  @JoinColumn({name: 'user2'})
  user2: User;

  @Column()
  user1Score: number;

  @Column()
  user2Score: number;
}
