import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class FriendList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friendList)
  @JoinColumn()
  user1: User;

  @ManyToOne(() => User, (user) => user.friendList)
  @JoinColumn()
  user2: User;
}