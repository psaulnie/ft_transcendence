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

import { manageRoomsArgs, sendMsgArgs, actionArgs } from './args.interface';
import { actionTypes, manageRoomsTypes, sendMsgTypes } from './args.types';
import { accessStatus } from 'src/chatModule/accessStatus';

@WebSocketGateway({
	cors: { origin: '*' },
	namespace: '/gateways/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	private mutedUsers: {username: string, time: Date}[];

	constructor(
		private roomService: RoomService,
		private userService: UserService,
	) { this.mutedUsers = []; }
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
			this.userService.updateClientID(user, client.id);
	}

	@SubscribeMessage('sendMsg')
	async handleMessage(client: Socket, payload: sendMsgArgs) {
		if (payload.data.length > 255)
			payload.data = payload.data.slice(0, 255);
		if (payload.isDirectMessage == true)
		{
			this.server.emit(payload.target, { 
				source: payload.source,
				target: payload.target,
				action: actionTypes.msg,
				data: payload.data,
				isDirectMessage: true,
				role: "none" })
		}
		if (payload.type == sendMsgTypes.msg && !this.mutedUsers.find((element) => element.username == payload.source))
		{
			const user = await this.userService.findOne(payload.source);
			const role = await this.roomService.getRole(payload.target, user.id);
			this.server.emit(payload.target, { 
				source: payload.source,
				target: payload.target,
				action: actionTypes.msg,
				data: payload.data,
				isDirectMessage: false,
				role: role })
		}
	}

	@SubscribeMessage('manageRooms')
	async handleRoom(client: Socket, payload: manageRoomsArgs) {
		const user = await this.userService.findOne(payload.source);
		if (payload.room.length > 10)
			payload.room = payload.room.slice(0, 255);
		if (client.id != user.clientId)
			await this.userService.updateClientID(user, client.id);
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
					this.server.emit(payload.source + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.ban })
					return ;
				}
				if (nbr == accessStatus.private)
				{
					this.server.emit(payload.source + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.private })
					return ;
				}
			}
			let mutedUser = this.mutedUsers.find((element) => element.username == payload.source);
			console.log(mutedUser);
			if (!mutedUser)
				this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.join })
			else
				this.server.emit(payload.source + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.mute, date: mutedUser.time})
		}
		else if (payload.type == manageRoomsTypes.remove)
		{
			await this.roomService.removeUser(payload.room, user.id);
			this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.left })
		}
		else if (payload.type == manageRoomsTypes.addDirectMsg)
		{
			this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.privmsg })
		}
	}

	@SubscribeMessage('kick')
	async kickUser(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOne(payload.target);
		await this.roomService.removeUser(payload.room, user.id);
		this.server.emit(payload.target + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.kick, role: "none" })
	}

	@SubscribeMessage('ban')
	async banUser(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOne(payload.target);
		await this.roomService.addToBanList(payload.room, user.id);
		this.server.emit(payload.target + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.ban, role: "none" })
	}

	@SubscribeMessage('block')
	async blockUser(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOneByClientId(client.id);
		const blockedUser = await this.userService.findOne(payload.target);
		
		if (user == null || blockedUser == null)
			return ; // TODO handle error
		await this.userService.blockUser(user, blockedUser.username);
		this.server.emit(payload.target + "OPTIONS", { source: payload.source, target: payload.target, action: actionTypes.block, role: "none" })
	}

	@SubscribeMessage('admin')
	async addAdmin(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOne(payload.target);
		
		if (user == null)
			return ; // TODO handle error
		await this.roomService.addAdmin(payload.room, user.id);
		this.server.emit(payload.target + "OPTIONS", { source: payload.room, target: payload.target, action: actionTypes.admin, role: "admin" })
	}

	@SubscribeMessage('mute')
	async muteUser(client: Socket, payload: actionArgs) {
		if (!this.mutedUsers.find((element) => element.username == payload.source))
			this.mutedUsers.push({username: payload.target, time: new Date()});
		setTimeout(() => {
			this.mutedUsers.filter(function(item) {
				return item.username !== payload.target;
			})
		});
		this.server.emit(payload.target + "OPTIONS", { source: payload.room, target: payload.target, action: actionTypes.mute, role: "none" })
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