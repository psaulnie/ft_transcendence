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
import { Inject } from '@nestjs/common';

@WebSocketGateway({
	cors: { origin: '*' },
	namespace: '/gateways/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private roomService: RoomService,
	) {}
	@WebSocketServer() server: Server;

	@SubscribeMessage('sendMsg')
	handleMessage(client: Socket, payload: string) {
		const arr = payload.split(' ');
		if (arr[0] == 'MSG')
		{
			payload = payload.replace(arr[0], '');
			payload = payload.replace(arr[1], '');
			this.server.emit(arr[1], payload);
		}
	}

	@SubscribeMessage('manageRooms')
	async handleRoom(client: Socket, payload: string) {
		const arr = payload.split(' ');
		// check if db exist, if not create it
		if (arr[1] == "ADD")
		{
			if (await this.roomService.findOne(arr[2]) == null)
				this.roomService.createRoom(arr[2], 1); // TODO change with the user ID
			else
				this.roomService.addUser(arr[2], 1); // TODO change with the user ID
			this.server.emit(arr[2], arr[0] + " JOIN")
		}
		else if (arr[1] == "REMOVE")
		{
			this.roomService.removeUser(arr[2], 1);
			this.server.emit(arr[2], arr[0] + " LEFT")
		}
	}

	afterInit(server: Server) {
		console.log('Init');
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}
}