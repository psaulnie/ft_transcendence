import { Controller, Query, Get, HttpException, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RoomService } from '../services/room.service';
import { UserService } from '../services/user.service';
import { UsersList } from 'src/entities/usersList.entity';
import { userStatus } from './userStatus';

@Controller('/api/chat/')
export class ChatController {
	constructor(private readonly roomService: RoomService, private readonly userService: UserService) {}

	@UseInterceptors(CacheInterceptor)
  	@Get('role/:username/:roomName')
  	async getRole(@Query() data: any, @Param('username') username: string, @Param('roomName') roomName: string): Promise<string> {
		if (username == null || roomName == null)
			throw new HttpException('Bad request', 400);
		const user = await this.userService.findOne(username);
		if (!user)
			throw new HttpException('Unprocessable Entity', 422);
		const room = await this.roomService.findOne(roomName);
		if (!room)
			throw new HttpException('Unprocessable Entity', 422);
		return (await this.roomService.getRole(room, user.id));
	}

	@UseInterceptors(CacheInterceptor)
	@Get(':username/blocked')
	async getBlockedUser(@Query() data: any, @Param("username") username: string): Promise<string[]> { // TODO fix function
		if (username == null)
			throw new HttpException('Bad request', 400);
		const user = await this.userService.findOne(username);
		if (!user)
			throw new HttpException('Unprocessable Entity', 422);
		let usersList = [];
		const blockedUsers = user.blockedUsers;
		blockedUsers.forEach((element) => {
			if (element.username)
				usersList.push(element.username);
		});
		return (usersList);
	}

	@UseInterceptors(CacheInterceptor)
	@Get('rooms/list')
	async getRoomsList(): Promise<{}[]> {
		const rooms = await this.roomService.findAll();
		let roomsList: {}[] = []; 

		rooms.forEach((element) => roomsList.push({
			roomName: element.roomName,
			hasPassword: (element.password !== ''),
			access: element.access
			}
		));
		return (roomsList);
	}

	@UseInterceptors(CacheInterceptor)
	@Get(':roomName/users')
	async getUsersInRoom(@Query() data: any, @Param('roomName') roomName: string): Promise<any[]> {
		if (roomName == null)
			throw new HttpException('Bad request', 400);
		const room = await this.roomService.findOne(roomName);
		if (!room)
			throw new HttpException('Unprocessable Entity', 422);
		let usersList = [];

		room.usersID.forEach((element: UsersList) => {
			if (element.user && element.user.username)
				usersList.push({username: element.user.username, role: element.role, isMuted: element.isMuted});
		})
		return (usersList);
	}

	@UseInterceptors(CacheInterceptor)
	@Get(':username/rooms/list')
	async getUserRoomsList(@Query() data: any, @Param("username") username: string): Promise<any[]> {
		if (username == null)
			throw new HttpException('Bad request', 400);
		const rooms = await this.roomService.findAll();
		if (!rooms)
			throw new HttpException('Unprocessable Entity', 422);
		let roomsList = [];
		rooms.forEach((element) => {
			let userInfo = element.usersID.find((obj) => obj.user.username == username);
			if (element.usersID.find((obj) => obj.user.username == username))
				roomsList.push({
					roomName: element.roomName,
					role: userInfo.role,
					isMuted: userInfo.isMuted,
					isBanned: userInfo.isBanned,
					hasPassword: element.password !== '',});
		});
		return (roomsList);
	}

	@UseInterceptors(CacheInterceptor)
	@Get(':roomName/exist')
	async getIsRoomNameTaken(@Query() data: any, @Param('roomName') roomName: string): Promise<boolean> {
		if (roomName == null)
			throw new HttpException('Bad request', 400);
		const room = await this.roomService.findOne(roomName);
		return (room != null);
	}

	@UseInterceptors(CacheInterceptor)
	@Get('users/list')
	async getUsersList(): Promise<string[]> {
		const users = await this.userService.findAll();
		let usersList: string[] = []; 

		users.forEach((element) => usersList.push(element.username))
		return (usersList);
	}

	@UseInterceptors(CacheInterceptor)
	@Get(':username/:roomName/status')
	async getUserStatusInRoom(@Query() data: any, @Param('username') username: string, @Param('roomName') roomName: string): Promise<any> {
		if (username == null || roomName == null)
			throw new HttpException('Bad request', 400);
		const room = await this.roomService.findOne(roomName);
		if (!room)
			throw new HttpException('Unprocessable Entity', 422);
		const user = room.usersID.find((obj) => obj.user.username == username);
		if (!user)
			throw new HttpException('Unprocessable Entity', 422);
		return ({ isMuted: user.isMuted, role: user.role, status: user.user.status });
	}

	@UseInterceptors(CacheInterceptor)
	@Get(':username/:roomName/invited')
	async getInvitedUsersList(@Query() data: any, @Param('username') username: string, @Param('roomName') roomName: string): Promise<{}[]> {
		if (username == null || roomName == null) // TODO handle error
			throw new HttpException('Bad request', 400);
		const users = await this.userService.findAll();
		let usersList: {}[] = [];

		for (const element of users) {
			if (element.username != username && (await this.roomService.isUserInRoom(roomName, element.id) == false && element.status == userStatus.online))
				usersList.push({label: element.username})
		}
		return (usersList);
	}
}