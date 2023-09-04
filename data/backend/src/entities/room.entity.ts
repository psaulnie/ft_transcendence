import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { UsersList } from './usersList.entity';
import { User } from './user.entity';
import { accessStatus } from 'src/gateway/accessStatus';

@Entity({ name: 'Room' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomName: string;

  @Column({
    type: 'enum',
    enum: accessStatus,
    default: accessStatus.public,
  })
  access: accessStatus;

  @Column()
  password: string;

  @ManyToOne(() => User, (user) => user.uid)
  @JoinColumn({ name: 'owner' })
  // @Column()
  owner: User;

  @Column()
  usersNumber: number;

  @OneToMany(() => UsersList, (usersList) => usersList.room, { eager: true })
  usersList: UsersList[];

  @AfterLoad()
  async nullCheck() {
    if (!this.usersList) this.usersList = [];
  }
}
