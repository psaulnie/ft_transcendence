import { Body, Controller, Query, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { UserService } from './user.service';

@Controller('/api/chat/')
export class ChatController {
	constructor(private readonly roomService: RoomService, private readonly userService: UserService) {}

  	@Get('role')
  	async getRole(@Query() data: any): Promise<string> {
		if (data.username == null || data.roomName == null)
			return (null);
		const user = await this.userService.findOne(data.username);
		return (await this.roomService.getRole(data.roomName, user.id));
	}

}