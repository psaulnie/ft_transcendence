import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { UsersList } from 'src/entities/usersList.entity';
import { Repository } from 'typeorm';
import { accessStatus } from './accessStatus';

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(Room)
		private roomsRepository: Repository<Room>,
		@InjectRepository(UsersList)
		private usersListRepository: Repository<UsersList>
	) {}

	async findOne(name: string): Promise<Room>
	{
		return await (this.roomsRepository.findOne({ where: { roomName: name }, relations: ['usersID', 'blockedUsersID', 'adminsID'] }));
	}

	async findAll(): Promise<Room[]>
	{
		return await (this.roomsRepository.find());
	}

	async createRoom(name: string, ownerID: number, access: number): Promise<Room>
	{
		const room = new Room();
		const usersList = new UsersList();

		usersList.userId = ownerID;
		// usersList.room = room;
		room.roomName = name;
		room.ownerID = ownerID;
		room.usersNumber = 1;
		room.access = access;
		room.password = "";
		if (!room.usersID)
			room.usersID = [];
		room.usersID.push(usersList);
		return await (this.roomsRepository.save(room));
	}

	async addRoom(room: Room): Promise<Room>
	{
		return await (this.roomsRepository.save(room));
	}

	async addUser(roomName: string, userId: number): Promise<number>
	{
		const room = await this.findOne(roomName);
		let rvalue = 0;
		if (room.access == accessStatus.private)
		{
			return (accessStatus.private);
		}
		room.blockedUsersID.forEach(user => {
			if (user.userId == userId)
			{
				rvalue = -1;
				return ;
			}
		});
		console.log(rvalue);
		if (rvalue == -1)
			return (rvalue);
		const newEntry = new UsersList();
		newEntry.userId = userId;
		room.usersNumber += 1;
		room.usersID.push(newEntry);
		await this.roomsRepository.save(room);
		return (accessStatus.public);
	}

	async removeUser(roomName: string, userId: number)
	{
		const room = await this.findOne(roomName);
		if (!(room))
			return ;
		room.usersNumber--;
		if (room.usersNumber <= 0)
		{
			this.removeRoom(roomName);
			return ;
		}
		room.usersID = room.usersID.filter(user => user.userId !== userId);
		await this.roomsRepository.save(room);
	}

	async removeRoom(name: string)
	{
		return await (this.roomsRepository.delete({roomName: name}));
	}

	async removeUserFromRooms(userId: number)
	{
		const rooms = this.findAll();
		(await rooms).forEach(element => {
			this.removeUser(element.roomName, userId);
		});
	}

	async getRole(roomName: string, userId: number): Promise<string>
	{
		const room = await this.findOne(roomName);
		if (room.ownerID == null) // TODO fix lag 
			return ("owner");
		if (room.ownerID == userId)
			return ("owner");
		room.adminsID.forEach(admin => {
			if (admin.userId == userId)
				return ("admin");
		});
		return ("none");
	}

	async addToBanList(roomName: string, userID: number): Promise<Room>
	{
		const room = await this.findOne(roomName);
		const newBlockedUser = new UsersList();
		newBlockedUser.userId = userID;
		room.blockedUsersID.push(await this.usersListRepository.save(newBlockedUser));
		return await (this.roomsRepository.save(room));
	}
}