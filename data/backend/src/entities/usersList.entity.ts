import internal from 'stream';
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: 'UsersList' })
export class UsersList {
	@PrimaryColumn()
	userId: number
}