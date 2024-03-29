import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';
import { userRole } from 'src/chatModule/chatEnums';

@Entity({ name: 'UsersList' })
export class UsersList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.none,
  })
  role: userRole;

  @ManyToOne(() => User, (user) => user.uid)
  @JoinColumn({ name: 'uid' })
  user: User;

  @Column()
  isBanned: boolean;

  @Column({ default: false })
  isMuted: boolean;

  @ManyToOne(() => Room, (room) => room.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;
}
