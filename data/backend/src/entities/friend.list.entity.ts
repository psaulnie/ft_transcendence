import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class FriendList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.uid)
  @JoinColumn()
  user1: User;

  @ManyToOne(() => User, (user) => user.uid)
  @JoinColumn()
  user2: User;
}
