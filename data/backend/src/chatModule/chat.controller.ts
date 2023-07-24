import { Controller, Query, Get, HttpException } from '@nestjs/common';
import { RoomService } from './room.service';
import { UserService } from './user.service';
import { UsersList } from 'src/entities/usersList.entity';
import { userStatus } from './userStatus';

@Controller('/api/chat/')
export class ChatController {
	constructor(private readonly roomService: RoomService, private readonly userService: UserService) {}

  	@Get('role')
  	async getRole(@Query() data: any): Promise<string> {
		if (data.username == null || data.roomName == null)
			throw new HttpException('Bad request', 400);
		const user = await this.userService.findOne(data.username);
		if (!user)
			throw new HttpException('Unprocessable Entity', 422);
		return (await this.roomService.getRole(data.roomName, user.id));
	}

	@Get('user/blocked')
	async getBlockedUser(@Query() data: any): Promise<string[]> { // TODO fix function
		if (data.username == null)
			throw new HttpException('Bad request', 400);
		const user = await this.userService.findOne(data.username);
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

	@Get('room/users')
	async getUsersInRoom(@Query() data: any): Promise<any[]> {
		if (data.roomName == null)
			throw new HttpException('Bad request', 400);
		const room = await this.roomService.findOne(data.roomName);
		if (!room)
			throw new HttpException('Unprocessable Entity', 422);
		let usersList = [];

		room.usersID.forEach((element: UsersList) => {
			if (element.user && element.user.username)
				usersList.push({username: element.user.username, role: element.role, isMuted: element.isMuted});
		})
		return (usersList);
	}

	@Get('rooms/exist')
	async getIsRoomNameTaken(@Query() data: any): Promise<boolean> {
		if (data.roomName == null)
			throw new HttpException('Bad request', 400);
		const room = await this.roomService.findOne(data.roomName);
		return (room != null);
	}

	@Get('users/list')
	async getUsersList(): Promise<string[]> {
		const users = await this.userService.findAll();
		let usersList: string[] = []; 

		users.forEach((element) => usersList.push(element.username))
		return (usersList);
	}

	@Get('user/room/info')
	async getUserInfoInRoom(@Query() data: any): Promise<any> {
		if (data.username == null || data.roomName == null)
			throw new HttpException('Bad request', 400);
		const room = await this.roomService.findOne(data.roomName);
		if (!room)
			throw new HttpException('Unprocessable Entity', 422);
		const user = room.usersID.find((obj) => obj.user.username == data.username);
		if (!user)
			throw new HttpException('Unprocessable Entity', 422);
		return ({ isMuted: user.isMuted, role: user.role, status: user.user.status });
	}

	@Get('users/list/filtered')
	async getFilteredUserList(@Query() data: any): Promise<{}[]> {
		if (data.username == null || data.roomName == null) // TODO handle error
			throw new HttpException('Bad request', 400);
		const users = await this.userService.findAll();
		let usersList: {}[] = [];

		for (const element of users) {
			console.log(element.username);
			console.log(await this.roomService.isUserInRoom(data.roomName, element.id) );
			if (element.username != data.username && (await this.roomService.isUserInRoom(data.roomName, element.id) == false && element.status == userStatus.online))
				usersList.push({label: element.username})
		}
		// users.forEach((element) => {
		// 	const isInRoom = await this.roomService.isUserInRoom(data.roomName, element.id);
		// 	if (element.username != data.username && (await this.roomService.isUserInRoom(data.roomName, element.id) == false && element.status == userStatus.online))
		// 		usersList.push({label: element.username})
		// });
		return (usersList);
	}
}