import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'MatchHistory' })
export class MatchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user1id: number;

  @Column()
  user2id: number;

  @Column()
  user1Score: number;

  @Column()
  user2Score: number;
}
