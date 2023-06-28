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
	
	constructor(
		private roomService: RoomService,
		private userService: UserService,
	) { }
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
		if (payload.data.length > 50)
			payload.data = payload.data.slice(0, 50);
		const user = await this.userService.findOne(payload.source);
		if (!user)
			return ; // TODO handle error
		console.log("sendmsg");
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
		if (payload.type == sendMsgTypes.msg && (await this.roomService.isMuted(payload.target, user)) === false)
		{
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
		let hasPassword = false;
		let role = "none";

		if (payload.room.length > 10)
			payload.room = payload.room.slice(0, 10);
		if (client.id != user.clientId)
			await this.userService.updateClientID(user, client.id);
		if (payload.type == manageRoomsTypes.add)
		{
			if (await this.roomService.findOne(payload.room) == null)
			{
				if (payload.access != accessStatus.protected)
					await this.roomService.createRoom(payload.room, user, payload.access);
				else
				{
					hasPassword = true;
					await this.roomService.createPasswordProtectedRoom(payload.room, user, payload.access, payload.password);
				}
				role = "owner";
			}
			else
			{
				if (payload.access == accessStatus.protected)
				{
					const roomPassword = await this.roomService.getPassword(payload.room);
					if (roomPassword != payload.password)
					{
						this.server.emit(payload.source + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.wrongpassword })
						return ;
					}
					hasPassword = true;
				}
				const nbr = await this.roomService.addUser(payload.room, user, false);
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
			if (this.roomService.isMuted(payload.room, user))
				this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.join })
			else
				this.server.emit(payload.source + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.mute})
			if (hasPassword == true)
				this.server.emit(payload.source + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.rightpassword, role: role})
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
		this.server.emit(payload.room, { source: payload.target, target: payload.room, action: actionTypes.left })
		this.server.emit(payload.target + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.kick, role: "none" })
	}

	@SubscribeMessage('ban')
	async banUser(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOne(payload.target);
		await this.roomService.addToBanList(payload.room, user);
		this.server.emit(payload.room, { source: payload.target, target: payload.room, action: actionTypes.left })
		this.server.emit(payload.target + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.ban, role: "none" })
	}

	@SubscribeMessage('block')
	async blockUser(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOne(payload.source);
		const blockedUser = await this.userService.findOne(payload.target);
		
		if (user == null || blockedUser == null)
			return ; // TODO handle error
		await this.userService.blockUser(user, blockedUser);
		console.log(await this.userService.findOne(payload.source));
	}

	@SubscribeMessage('unblock')
	async unblockUser(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOneByClientId(client.id);
		const blockedUser = await this.userService.findOne(payload.target);
		
		if (user == null || blockedUser == null)
			return ; // TODO handle error
		await this.userService.unblockUser(user, blockedUser);
	}

	@SubscribeMessage('admin')
	async addAdmin(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOne(payload.target);
		
		if (user == null)
			return ; // TODO handle error
		await this.roomService.addAdmin(payload.room, user);
		this.server.emit(payload.target + "OPTIONS", { source: payload.room, target: payload.target, action: actionTypes.admin, role: "admin" })
	}

	@SubscribeMessage('mute')
	async muteUser(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOne(payload.target);

		if (user == null)
			return ; // TODO handle error
		await this.roomService.addToMutedList(payload.room, user);
		this.server.emit(payload.target + "OPTIONS", { source: payload.room, target: payload.target, action: actionTypes.mute, role: "none" })
	}

	@SubscribeMessage('unmute')
	async unmuteUser(client: Socket, payload: actionArgs) {
		const user = await this.userService.findOne(payload.target);

		if (user == null)
			return ; // TODO handle error
		await this.roomService.removeFromMutedList(payload.room, user);
		this.server.emit(payload.target + "OPTIONS", { source: payload.room, target: payload.target, action: actionTypes.unmute, role: "none" })
	}

	@SubscribeMessage('setPasswordToRoom')
	async setPasswordToRoom(client: Socket, payload: {room: string, password: string}) {
		this.roomService.setPasswordToRoom(payload.room, payload.password);
		this.server.emit(payload.room, { source: payload.room, target: payload.room, action: actionTypes.hasPassword });
	}

	@SubscribeMessage('removePasswordToRoom')
	async removePasswordToRoom(client: Socket, payload: string) {
		this.roomService.removePasswordToRoom(payload);
		this.server.emit(payload, { source: payload, target: payload, action: actionTypes.noPassword });
	}

	@SubscribeMessage('inviteUser')
	async inviteUser(client: Socket, payload: {roomName: string, username: string, hasPassword: boolean}) {
		if (!payload.roomName || !payload.username)
			return ;
		this.server.emit(payload.username + "OPTIONS", { source: payload.roomName, target: payload.username, action: actionTypes.invited, hasPassword: payload.hasPassword });
	}

	@SubscribeMessage('joinPrivateRoom')
	async joinPrivateRoom(client: Socket, payload: {roomName: string, username: string}) {
		if (!payload.roomName || !payload.username)
			return ;
		const user = await this.userService.findOne(payload.username);
		if (!user)
			return ;
		await this.roomService.addUser(payload.roomName, user, true);
		this.server.emit(payload.roomName, { source: payload.username, target: payload.roomName, action: actionTypes.join })
	}

	async afterInit(server: Server) {
		console.log('Init');
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		const user = await this.userService.findOneByClientId(client.id);
		if (!user)
			return ;
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