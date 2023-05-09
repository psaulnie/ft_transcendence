import internal from 'stream';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";

// @Entity({ name: 'UsersList' })
// export class UsersList {
// 	@PrimaryGeneratedColumn()
// 	id: number

// 	@ManyToOne(() => Rooms, rooms => rooms.usersID)
// 	userId: number
// }

// @Entity({ name: 'AdminsList' })
// export class AdminsList {
// 	@PrimaryGeneratedColumn()
// 	id: number

// 	@ManyToOne(() => Rooms, rooms => rooms.adminsID)
// 	userId: number
// }

// @Entity({ name: 'BlockedUsersList' })
// export class BlockedUsersList {
// 	@PrimaryGeneratedColumn()
// 	id: number

// 	@ManyToOne(() => Rooms, rooms => rooms.blockedUsersID)
// 	userId: number
// }

@Entity({ name: 'Rooms' })
export class Rooms {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	password: string

	@Column()
	ownerID: number

	// To check, there's multiple value
	// @OneToMany(() => UsersList, userslist => userslist.userId)
	// usersID: number

	// @OneToMany(() => AdminsList, adminslist => adminslist.userId)
	// adminsID: number

	// @OneToMany(() => BlockedUsersList, blockeduserslist => blockeduserslist.userId)
	// blockedUsersID: number

}