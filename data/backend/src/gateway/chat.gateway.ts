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

import { manageRoomsArgs, banArgs, kickArgs, sendMsgArgs } from './args.interface';
import { actionTypes, manageRoomsTypes, sendMsgTypes } from './args.types';
import { accessStatus } from 'src/chatModule/accessStatus';

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
			this.userService.updateClientID(user, client.id);
		}
	}

	@SubscribeMessage('sendMsg')
	async handleMessage(client: Socket, payload: sendMsgArgs) {
		console.log(payload);
		if (payload.type == sendMsgTypes.msg)
		{
			this.server.emit(payload.target, { source: payload.source , target: payload.target, action: actionTypes.msg, data: payload.data })
			// this.server.emit(payload.target, payload.source + ': ' + payload.data);
		}
	}

	@SubscribeMessage('manageRooms')
	async handleRoom(client: Socket, payload: manageRoomsArgs) {
		const user = await this.userService.findOne(payload.source);
		if (client.id != user.clientId)
		{
			await this.userService.updateClientID(user, client.id);
		}
		if (payload.type == manageRoomsTypes.add)
		{
			if (await this.roomService.findOne(payload.room) == null)
			{
				await this.roomService.createRoom(payload.room, user.id, payload.access);
			}
			else
			{
				const nbr = await this.roomService.addUser(payload.room, user.id);
				if (nbr == -1)
				{
					this.server.emit(payload.source, { source: payload.source, target: payload.room, action: actionTypes.ban })
					return ;
				}
				if (nbr == accessStatus.private)
				{
					this.server.emit(payload.source, { source: payload.source, target: payload.room, action: actionTypes.private })
					return ;
				}
			}
			this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.join })
		}
		else if (payload.type == manageRoomsTypes.remove)
		{
			await this.roomService.removeUser(payload.room, user.id);
			console.log({ source: payload.source, target: payload.room, action: actionTypes.left });
			this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.left })
		}
	}

	@SubscribeMessage('kick')
	async kickUser(client: Socket, payload: kickArgs) {
		const user = await this.userService.findOne(payload.target);
		await this.roomService.removeUser(payload.room, user.id);
		this.server.emit(payload.target, { source: payload.source, target: payload.room, action: actionTypes.kick })
	}

	@SubscribeMessage('ban')
	async banUser(client: Socket, payload: banArgs) {
		const user = await this.userService.findOne(payload.target);
		await this.roomService.addToBanList(payload.room, user.id);
		await this.roomService.removeUser(payload.room, user.id);
		this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.ban })
	}

	async afterInit(server: Server) {
		console.log('Init');
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`); // TODO fix clientId update
		const user = await this.userService.findOneByClientId(client.id);
		if (!user)
			return ;
		console.log(user);
		user.status = userStatus.offline;
		// this.roomService.removeUserFromRooms(user.id);
		const rooms = await this.roomService.findAll();
		rooms.forEach(element => {
			this.roomService.removeUser(element.roomName, user.id);
			this.server.emit(element.roomName, { source: user.username, target: element.roomName, action: actionTypes.left })
		});
	}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}
}