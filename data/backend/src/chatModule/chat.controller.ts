import { Controller, Query, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { UserService } from './user.service';
import { UsersList } from 'src/entities/usersList.entity';

@Controller('/api/chat/')
export class ChatController {
	constructor(private readonly roomService: RoomService, private readonly userService: UserService) {}

  	@Get('role')
  	async getRole(@Query() data: any): Promise<string> {
		if (data.username == null || data.roomName == null) // TODO check
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
	async getBlockedUser(@Query() data: any): Promise<string> {
		if (data.username == null) // TODO check
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}
		const user = await this.userService.findOne(data.username);
		let blockedUsersID;

		if (user)
			blockedUsersID = user.blockedUsersID;	
		else
			blockedUsersID = [];
		const res = {
			status: 'success',
			data: blockedUsersID
		}
		return JSON.stringify(res);
	}

	@Get('rooms/list')
	async getRoomsList(): Promise<string> {
		const rooms = await this.roomService.findAll(); // TODO send only needed column
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
		if (data.roomName == null) // TODO check
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}
		const room = await this.roomService.findOneAllLoaded(data.roomName);
		let usersList = [];

		console.log(room.usersID);
		room.usersID.forEach((element: UsersList) => {
			console.log(element);
			usersList.push({username: element.user.username, role: element.role});
		})
		// usersList.push({name: });
		const res = {
			status: 'success',
			data: usersList
		}
		return JSON.stringify(res);
	}

	@Get('rooms/exist')
	async getIsRoomNameTaken(@Query() data: any): Promise<string> {
		if (data.roomName == null) // TODO check
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

		users.forEach((element) => usersList.push(element.username)) // TODO return also is online or not
		const res = {
			status: 'success',
			data: usersList
		}
		return JSON.stringify(res);
	}

	@Get('users/list/filtered')
	async getFilteredUserList(@Query() data: any): Promise<string> {
		if (data.username == null || data.roomName == null) // TODO check
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
		}) // TODO return also is online or not
		const res = {
			status: 'success',
			data: usersList
		}
		return JSON.stringify(res);
	}
}