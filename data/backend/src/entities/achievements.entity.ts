import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Achievements' })
export class Achievements {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  achievement1: boolean;

  @Column({ default: false })
  achievement2: boolean;

  @Column({ default: false })
  achievement3: boolean;

  @Column({ default: false })
  achievement4: boolean;

  @Column({ default: false })
  achievement5: boolean;
}
