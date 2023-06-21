import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { User } from 'src/entities/user.entity';
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

	async findOneAllLoaded(name: string): Promise<Room>
	{
		return await (this.roomsRepository.findOne({ where: { roomName: name }, relations: ['usersID', 'blockedUsersID', 'adminsID', 'usersID.user'] }));
	}

	async findAll(): Promise<Room[]>
	{
		return await (this.roomsRepository.find());
	}

	async createRoom(name: string, user: User, access: number): Promise<Room>
	{
		const room = new Room();
		const usersList = new UsersList();

		usersList.userId = user.id;
		usersList.user = user;
		usersList.role = 'owner';
		usersList.isBanned = false;
	
		room.roomName = name;
		room.ownerID = user.id;
		room.usersNumber = 1;
		room.access = access;
		room.password = "";
		if (!room.usersID)
			room.usersID = [];
		room.usersID.push(usersList);
		return await (this.roomsRepository.save(room));
	}

	async createPasswordProtectedRoom(name: string, user: User, access: number, password: string): Promise<Room>
	{
		const room = new Room();
		const usersList = new UsersList();

		usersList.userId = user.id;
		usersList.user = user;
		usersList.role = 'owner';
		usersList.isBanned = false;

		room.roomName = name;
		room.ownerID = user.id;
		room.usersNumber = 1;
		room.access = access;
		room.password = password;
		if (!room.usersID)
			room.usersID = [];
		room.usersID.push(usersList);
		return await (this.roomsRepository.save(room));
	}

	async addRoom(room: Room): Promise<Room>
	{
		return await (this.roomsRepository.save(room));
	}

	async addUser(roomName: string, user: User, invited: boolean): Promise<number>
	{
		const room = await this.findOne(roomName);
		if (!room)
			return ;
		let rvalue = 0;
		if (room.access == accessStatus.private && !invited)
		{
			return (accessStatus.private);
		}
		room.blockedUsersID.forEach(user => {
			if (user.userId == user.id)
			{
				rvalue = -1;
				return ;
			}
		});
		if (rvalue == -1)
			return (rvalue);
		const newEntry = new UsersList();

		newEntry.userId = user.id;
		newEntry.user = user;
		newEntry.role = 'none';
		newEntry.isBanned = false;

		room.usersNumber += 1;
		room.usersID.push(newEntry);
		await this.usersListRepository.save(newEntry);
		await this.roomsRepository.save(room);
		return (accessStatus.public);
	}

	async removeUser(roomName: string, userId: number)
	{
		const room = await this.findOne(roomName);
		if (!(room))
			return ;
		console.log("-1 user in " + roomName);
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
		let	isAdmin = false;
		const room = await this.findOne(roomName);
		if (room == null)
			return (null); // TODO check and/or fix
		if (room.ownerID == userId)
			return ("owner");
		room.usersID.forEach(user => {
			if (user.role == 'admin' && user.userId == userId)
			{
				isAdmin = true;
				return ;
			}
		});
		if (isAdmin)
			return ("admin");
		return ("none");
	}

	async addToBanList(roomName: string, user: User): Promise<Room>
	{
		const room = await this.findOne(roomName);
		const userInList = room.usersID.find((obj) => obj.userId == user.id);
		const newBlockedUser = new UsersList();

		newBlockedUser.userId = user.id;
		userInList.isBanned = true;
		await this.roomsRepository.save(userInList);
		room.blockedUsersID.push(await this.usersListRepository.save(newBlockedUser));
		return await (this.roomsRepository.save(room));
	}

	async addAdmin(roomName: string, user: User): Promise<Room>
	{
		const room = await this.findOne(roomName);
		const userInList = room.usersID.find((obj) => obj.userId == user.id);
		const newAdmin = new UsersList();

		userInList.role = 'admin';
		newAdmin.userId = user.id;
		await this.roomsRepository.save(userInList);
		room.adminsID.push(await this.usersListRepository.save(newAdmin));
		return await (this.roomsRepository.save(room));
	}

	async getPassword(roomName: string): Promise<string>
	{
		const room = await this.findOne(roomName);

		return (room.password);
	}

	async setPasswordToRoom(roomName: string, password: string)
	{
		const room = await this.findOne(roomName)
		if (room)
		{
			room.password = password;
			room.access = accessStatus.protected;
			await this.roomsRepository.save(room);
		}
	}

	async removePasswordToRoom(roomName: string)
	{
		const room = await this.findOne(roomName)
		if (room)
		{
			room.password = '';
			room.access = accessStatus.public;
			await this.roomsRepository.save(room);
		}
	}

	async isUserInRoom(roomName: string, userID: number): Promise<boolean>
	{
		const room = await this.findOne(roomName);
		if (!room || !room.usersID.find((obj: any) => obj.userId == userID))
			return (false);
		else
			return (true);
	}

}