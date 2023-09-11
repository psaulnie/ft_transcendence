import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Statistics' })
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  winNbr: number;

  @Column({ default: 0 })
  loseNbr: number;

  @Column({ default: 0 })
  matchNumber: number;

  @Column({ default: 0 })
  rank: number;

  @Column({ default: 0 })
  streak: number;
}
