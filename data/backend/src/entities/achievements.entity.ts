import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Achievements' })
export class Achievements {
	@PrimaryColumn()
	userId: number

	// Need to insert all of the achievements with boolean and title
}