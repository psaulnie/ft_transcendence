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
			// return (null);
		const user = await this.userService.findOne(data.username);
		// const role = await this.roomService.getRole(data.roomName, user.id);
		// return (await this.roomService.getRole(data.roomName, user.id));
		console.log(data);
		const res = {
			status: 'success',
			data: await this.roomService.getRole(data.roomName, user.id)
		 }
		 return JSON.stringify(res);
	}

	@Get('blocked')
	async getBlockedUser(@Query() data: any): Promise<string> {
		console.log("getBlockedUser");
		if (data.username == null) // TODO check
		{
			const res = {
				statusCode: 400,
				status: "failed"
			};
			return (JSON.stringify(res));
		}
		const user = await this.userService.findOne(data.username);
		console.log(user);
		const res = {
			status: 'success',
			data: user.blockedUsersID
		}
		return JSON.stringify(res);
  }

}