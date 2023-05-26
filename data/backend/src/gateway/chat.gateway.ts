import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
   } from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { RoomService } from 'src/chatModule/room.service';
import { UserService } from 'src/chatModule/user.service';
import { userStatus } from 'src/chatModule/userStatus';

@WebSocketGateway({
	cors: { origin: '*' },
	namespace: '/gateways/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private roomService: RoomService,
		private userService: UserService,
	) {}
	@WebSocketServer() server: Server;

	@SubscribeMessage('newUser')
	async createUser(client: Socket, payload: string) {
		const user = await this.userService.findOne(payload);
		if (user == null)
		{
			console.log("New user: " + payload);
			await this.userService.createUser(payload, client.id);
		}
		else
		{
			user.clientId = client.id;
			user.status = userStatus.online;
		}
	}

	@SubscribeMessage('sendMsg')
	async handleMessage(client: Socket, payload: string) {
		const arr = payload.split(' ');
		if (arr[0] == 'MSG')
		{
			payload = payload.replace(arr[0], '');
			payload = payload.replace(arr[1], '');
			payload.trim();
			this.server.emit(arr[1], payload.trim());
		}
	}

	@SubscribeMessage('manageRooms')
	async handleRoom(client: Socket, payload: string) {
		const arr = payload.split(' ');
		const user = await this.userService.findOne(arr[0]);
		if (arr[1] == "ADD")
		{
			if (await this.roomService.findOne(arr[2]) == null)
			{
				await this.roomService.createRoom(arr[2], user.id);
			}
			else
			{
				const nbr = await this.roomService.addUser(arr[2], user.id);
				if (nbr == -1)
				{
					this.server.emit(arr[0], "BAN " + arr[2]);
					return ;
				}
			}
			this.server.emit(arr[2], arr[0] + " JOIN")
		}
		else if (arr[1] == "REMOVE")
		{
			await this.roomService.removeUser(arr[2], user.id);
			this.server.emit(arr[2], arr[0] + " LEFT")
		}
	}

	@SubscribeMessage('kick')
	async kickUser(client: Socket, payload: string) {
		const arr = payload.split(' ');
		const user = await this.userService.findOne(arr[0]);
		await this.roomService.removeUser(arr[1], user.id);
		this.server.emit(arr[0], "KICK " + arr[1]);
	}

	@SubscribeMessage('ban')
	async banUser(client: Socket, payload: string) {
		const arr = payload.split(' ');
		const user = await this.userService.findOne(arr[0]);
		await this.roomService.addToBanList(arr[1], user.id);
		await this.roomService.removeUser(arr[1], user.id);
		this.server.emit(arr[0], "BAN " + arr[1]);
	}

	async afterInit(server: Server) {
		console.log('Init');
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`); // TODO fix clientId update
		// const user = await this.userService.findOneByClientId(client.id);

		// user.status = userStatus.offline;
		// this.roomService.removeUserFromRooms(user.id);
		
	}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}
}