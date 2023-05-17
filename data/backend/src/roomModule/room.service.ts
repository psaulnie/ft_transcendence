import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { UsersList } from 'src/entities/usersList.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(Room)
		private roomsRepository: Repository<Room>,
	) {}

	async findOne(name: string): Promise<Room>
	{
		return await (this.roomsRepository.findOne({where: { roomName: name }}));
	}

	async findAll(): Promise<Room[]>
	{
		return await (this.roomsRepository.find());
	}

	// async createRoom(name: string, ownerID: number): Promise<Room>
	// {
	// 	return await ()
	// }

	async addRoom(room: Room): Promise<Room>
	{
		return await (this.roomsRepository.save(room));
	}

	// async addUser(roomName: string, userId: number)
	// {
	// 	const room = this.findOne(roomName);
	// 	const newEntry = new UsersList();

	// 	newEntry.userId = userId;
	// 	(await room).usersNumber += 1;
	// 	(await room).usersID.push(newEntry);
	// 	// return await (this.usersListRepository.save((await room).usersID))
	// }

	// async removeUser(roomName: string, userId: number)
	// {
	// 	const room = this.findOne(roomName);
	// 	(await room).usersID = (await room).usersID.filter(user => user.userId !== userId);
	// 	this.roomsRepository.save(await room);
	// }

	async removeRoom(name: string)
	{
		return await (this.roomsRepository.delete({roomName: name}));
	}

	// async addConnectedRooms(): Promise<User>
	// {

	// }
}