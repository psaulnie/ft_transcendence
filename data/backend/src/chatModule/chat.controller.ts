import { Controller, Query, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { UserService } from './user.service';

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
		const res = {
			status: 'success',
			data: user.blockedUsersID
		}
		return JSON.stringify(res);
	}

	@Get('rooms/list')
	async getRoomsList(): Promise<string> {
		const roomsList = await this.roomService.findAll(); // TODO send only needed column

		const res = {
			status: 'success',
			data: roomsList
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

		users.forEach((element) => usersList.push(element.username))
		const res = {
			status: 'success',
			data: usersList
		}
		return JSON.stringify(res);
	}
}