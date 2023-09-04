import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Achievements' })
export class Achievements {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.uid)
  @JoinColumn({ name: 'user' })
  user: User;

  @Column()
  achievement1: boolean;

  @Column()
  achievement2: boolean;

  @Column()
  achievement3: boolean;

  @Column()
  achievement4: boolean;

  @Column()
  achievement5: boolean;
}
