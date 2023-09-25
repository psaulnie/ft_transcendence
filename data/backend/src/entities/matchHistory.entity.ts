import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
