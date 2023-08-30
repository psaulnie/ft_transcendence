import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class FriendList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uid1' })
  uid1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uid2' })
  uid2: User;
}
