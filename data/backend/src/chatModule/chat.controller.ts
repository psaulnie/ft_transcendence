import { Controller, Query, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { UserService } from './user.service';
import { UsersList } from 'src/entities/usersList.entity';

@Controller('/api/chat/')
export class ChatController {
	constructor(private readonly roomService: RoomService, private readonly userService: UserService) {}

  	@Get('role')
  	async getRole(@Query() data: any): Promise<string> {
		if (data.username == null || data.roomName == null) // TODO handle error
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}
		const user = await this.userService.findOne(data.username);
		const res = {
			status: 'success',
			data: await this.roomService.getRole(data.roomName, user.id)
		 }
		 return JSON.stringify(res);
	}

	@Get('blocked')
	async getBlockedUser(@Query() data: any): Promise<string> { // TODO fix function
		if (data.username == null) // TODO handle error
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}
		const user = await this.userService.findOne(data.username);

		const res = {
			status: 'success',
			data: []
		}
		return JSON.stringify(res);
	}

	@Get('rooms/list')
	async getRoomsList(): Promise<string> {
		const rooms = await this.roomService.findAll();
		let roomsList: {}[] = []; 

		rooms.forEach((element) => roomsList.push({
			roomName: element.roomName,
			hasPassword: (element.password !== ''),
			access: element.access
			}
		));
		const res = {
			status: 'success',
			data: roomsList
		}
		return JSON.stringify(res);
	}

	@Get('room/users')
	async getUsersInRoom(@Query() data: any): Promise<string> {
		if (data.roomName == null) // TODO handle error
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}
		const room = await this.roomService.findOne(data.roomName);
		let usersList = [];

		room.usersID.forEach((element: UsersList) => {
			console.log(element);
			if (element.user && element.user.username)
				usersList.push({username: element.user.username, role: element.role, isMuted: element.isMuted});
		})

		const res = {
			status: 'success',
			data: usersList
		}
		return JSON.stringify(res);
	}

	@Get('rooms/exist')
	async getIsRoomNameTaken(@Query() data: any): Promise<string> {
		if (data.roomName == null) // TODO handle error
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}
		const room = await this.roomService.findOne(data.roomName);
		const exist = (room != null);
		const res = {
			status: 'success',
			data: exist
		}
		return JSON.stringify(res);
	}

	@Get('users/list')
	async getUsersList(): Promise<string> {
		const users = await this.userService.findAll();
		let usersList: string[] = []; 

		users.forEach((element) => usersList.push(element.username))
		const res = {
			status: 'success',
			data: usersList
		}
		return JSON.stringify(res);
	}

	@Get('user/room/info')
	async getUserInfoInRoom(@Query() data: any): Promise<string> {
		if (data.username == null || data.roomName == null) // TODO handle error
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}
		const room = await this.roomService.findOne(data.roomName);
		if (!room)
			return ; // TODO handle error

		const user = room.usersID.find((obj) => obj.user.username == data.username);
		if (!user)
			return ; // TODO handle error
		const res = {
			status: 'success',
			data: { isMuted: user.isMuted, role: user.role, status: user.user.status }
		}
		return JSON.stringify(res);
	}

	@Get('users/list/filtered')
	async getFilteredUserList(@Query() data: any): Promise<string> {
		if (data.username == null || data.roomName == null) // TODO handle error
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}

		const users = await this.userService.findAll();
		let usersList: {}[] = [];

		users.forEach((element) => {
			if (element.username != data.username && this.roomService.isUserInRoom(data.roomName, element.id))
				usersList.push({label: element.username})
		});
		const res = {
			status: 'success',
			data: usersList
		}
		return JSON.stringify(res);
	}
}