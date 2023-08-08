import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WsException,
   } from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { RoomService } from 'src/services/room.service';
import { UserService } from 'src/services/user.service';

import { sendMsgArgs, actionArgs } from './args.interface';
import { actionTypes } from './args.types';
import { accessStatus } from 'src/chatModule/accessStatus';

@WebSocketGateway({
	cors: { origin: '*' },
	namespace: '/gateway',
})
export class Gateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	constructor(
		private roomService: RoomService,
		private userService: UserService,
	) { }
	@WebSocketServer() server: Server;

	@SubscribeMessage('newUser')
	async createUser(client: Socket, payload: string) {
		if (!payload)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload);
		if (user == null)
		{
			console.log("New user: " + payload);
			await this.userService.createUser(payload, client.id);
		}
		else
			throw new WsException("User already exists");
	}

	@SubscribeMessage('sendPrivateMsg')
	async sendPrivateMessage(client: Socket, payload: sendMsgArgs) {
		if (payload.data == null || payload.source == null || payload.target == null || payload.type == null)
			throw new WsException("Missing parameter");
		if (payload.data.length > 50)
			payload.data = payload.data.slice(0, 50);
		const user = await this.userService.findOne(payload.source);
		console.log("sendprivmsg");
		if (!user)
			throw new WsException("Source user not found");
		const targetUser = await this.userService.findOne(payload.target);
		if (!targetUser)
			throw new WsException("Target user not found");
		if (targetUser.blockedUsers.includes(user))
			throw new WsException("Target user blocked source user");
		this.server.emit(payload.target, { 
			source: payload.source,
			target: payload.target,
			action: actionTypes.msg,
			data: payload.data,
			isDirectMessage: true,
			role: "none" });
	}

	@SubscribeMessage('sendMsg')
	async sendMsg(client: Socket, payload: sendMsgArgs) {
		if (payload.data == null || payload.source == null || payload.target == null || payload.type == null)
			throw new WsException("Missing parameter");
		if (payload.data.length > 50)
			payload.data = payload.data.slice(0, 50);
		const user = await this.userService.findOne(payload.source);
		console.log("sendmsg");
		if (!user)
			throw new WsException("Source user not found");
		const room = await this.roomService.findOne(payload.target);
		if (!room)
			throw new WsException("Room not found");
		if (room.usersID.find((tmpUser) => tmpUser.user == user))
			throw new WsException("User not in room");
		let role = await this.roomService.getRole(room, user.id);
		if (!role)
			role = "none";
		this.server.emit(payload.target, { 
			source: payload.source,
			target: payload.target,
			action: actionTypes.msg,
			data: payload.data,
			isDirectMessage: false,
			role: role });
	}

	@SubscribeMessage('joinRoom')
	async joinRoom(client: Socket, payload: any) {
		if (payload.access == null || payload.room == null || payload.source == null)
			throw new WsException("Missing parameter");
		if (payload.access == accessStatus.protected && payload.password == null)
			throw new WsException("Missing parameter");	
		const user = await this.userService.findOne(payload.source);
		if (!user)
			throw new WsException("Source user not found");
		let hasPassword = false;
		let role = "none";
		if (payload.room.length > 10)
			payload.room = payload.room.slice(0, 10);
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

	@SubscribeMessage('leaveRoom')
	async leaveRoom(client: Socket, payload: any) {
		if (payload.access == null || payload.room == null || payload.source == null)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload.source);
		if (!user)
			throw new WsException("Source user not found");
		await this.roomService.removeUser(payload.room, user.id);
		this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.left })
	}

	@SubscribeMessage('openPrivateMessage')
	async openPrivateMessage(client: Socket, payload: any) {
		if (payload.access == null || payload.room == null || payload.source == null)
			throw new WsException("Missing parameter");
		if (payload.access == accessStatus.protected && payload.password == null)
			throw new WsException("Missing parameter");	
		const user = await this.userService.findOne(payload.source);
		if (!user)
			throw new WsException("Source user not found");
		if (payload.room.length > 10)
			payload.room = payload.room.slice(0, 10);
		this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.privmsg })
	}
	
	@SubscribeMessage('kick')
	async kickUser(client: Socket, payload: actionArgs) {
		if (payload.room == null || payload.source == null || payload.target == null)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload.target);
		if (!user)
			throw new WsException("Target user not found");
		const admin = await this.userService.findOne(payload.source);
		if (!admin)
			throw new WsException("Source user not found");
		const room = await this.roomService.findOne(payload.room);
		if (!room)
			throw new WsException("Room not found");
		if (await this.roomService.getRole(room, admin.id) == "none")
			throw new WsException("Source user is not admin of the room");
		await this.roomService.removeUser(payload.room, user.id);
		this.server.emit(payload.room, { source: payload.target, target: payload.room, action: actionTypes.left })
		this.server.emit(payload.target + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.kick, role: "none" })
	}

	@SubscribeMessage('ban')
	async banUser(client: Socket, payload: actionArgs) {
		if (payload.room == null || payload.source == null || payload.target == null)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload.target);
		if (!user)
			throw new WsException("Target user not found");
		const admin = await this.userService.findOne(payload.source);
		if (!admin)
			throw new WsException("Source user not found");
		const room = await this.roomService.findOne(payload.room);
		if (!room)
			throw new WsException("Room not found");
		if (await this.roomService.getRole(room, admin.id) == "none")
			throw new WsException("Source user is not admin of the room");
		await this.roomService.addToBanList(payload.room, user);
		this.server.emit(payload.room, { source: payload.target, target: payload.room, action: actionTypes.left })
		this.server.emit(payload.target + "OPTIONS", { source: payload.source, target: payload.room, action: actionTypes.ban, role: "none" })
	}

	@SubscribeMessage('block')
	async blockUser(client: Socket, payload: actionArgs) {
		if (payload.room == null || payload.source == null || payload.target == null)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload.source);
		const blockedUser = await this.userService.findOne(payload.target);
		
		if (user == null || blockedUser == null)
			throw new WsException("User not found");
		await this.userService.blockUser(user, blockedUser);
		console.log(await this.userService.findOne(payload.source));
	}

	@SubscribeMessage('unblock')
	async unblockUser(client: Socket, payload: actionArgs) {
		if (payload.room == null || payload.source == null || payload.target == null)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload.source);
		const blockedUser = await this.userService.findOne(payload.target);
		
		if (user == null || blockedUser == null)
			throw new WsException("User not found");
		await this.userService.unblockUser(user, blockedUser);
	}

	@SubscribeMessage('admin')
	async addAdmin(client: Socket, payload: actionArgs) {
		if (payload.room == null || payload.source == null || payload.target == null)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload.target);
		if (user == null)
			throw new WsException("User not found");
		const admin = await this.userService.findOne(payload.source);
		if (!admin)
			throw new WsException("Source user not found");
		const room = await this.roomService.findOne(payload.room);
		if (!room)
			throw new WsException("Room not found");
		if (await this.roomService.getRole(room, admin.id) == "none")
			throw new WsException("Source user is not admin of the room");	
		await this.roomService.addAdmin(payload.room, user);
		this.server.emit(payload.target + "OPTIONS", { source: payload.room, target: payload.target, action: actionTypes.admin, role: "admin" })
	}

	@SubscribeMessage('mute')
	async muteUser(client: Socket, payload: actionArgs) {
		if (payload.room == null || payload.source == null || payload.target == null)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload.target);
		if (user == null)
			throw new WsException("User not found");
		const admin = await this.userService.findOne(payload.source);
		if (!admin)
			throw new WsException("Source user not found");
		const room = await this.roomService.findOne(payload.room);
			if (!room)
				throw new WsException("Room not found");
		if (await this.roomService.getRole(room, admin.id) == "none")
			throw new WsException("Source user is not admin of the room");
		await this.roomService.addToMutedList(payload.room, user);
		this.server.emit(payload.target + "OPTIONS", { source: payload.room, target: payload.target, action: actionTypes.mute, role: "none" })
	}

	@SubscribeMessage('unmute')
	async unmuteUser(client: Socket, payload: actionArgs) {
		if (payload.room == null || payload.source == null || payload.target == null)
			throw new WsException("Missing parameter");
		const user = await this.userService.findOne(payload.target);

		if (user == null)
			throw new WsException("User not found");
		const admin = await this.userService.findOne(payload.source);
		if (!admin)
			throw new WsException("Source user not found");
		const room = await this.roomService.findOne(payload.room);
		if (!room)
			throw new WsException("Room not found");
		if (await this.roomService.getRole(room, admin.id) == "none")
			throw new WsException("Source user is not admin of the room");
		await this.roomService.removeFromMutedList(payload.room, user);
		this.server.emit(payload.target + "OPTIONS", { source: payload.room, target: payload.target, action: actionTypes.unmute, role: "none" })
	}

	@SubscribeMessage('setPasswordToRoom')
	async setPasswordToRoom(client: Socket, payload: {room: string, password: string, source: string}) {
		if (payload.room == null || payload.password == null || payload.source == null)
			throw new WsException("Missing parameter");
		console.log("setPasswordToRoom");
		const admin = await this.userService.findOne(payload.source);
		if (!admin)
			throw new WsException("Source user not found");
		const room = await this.roomService.findOne(payload.room);
		if (!room)
			throw new WsException("Room not found");
		if (await this.roomService.getRole(room, admin.id) == "none")
			throw new WsException("Source user is not admin of the room");
		this.roomService.setPasswordToRoom(payload.room, payload.password);
		this.server.emit(payload.room, { source: payload.room, target: payload.room, action: actionTypes.hasPassword });
	}

	@SubscribeMessage('removePasswordToRoom')
	async removePasswordToRoom(client: Socket, payload: { room: string, source: string }) {
		if (payload.room == null || payload.source == null)
			throw new WsException("Missing parameter");
		const admin = await this.userService.findOne(payload.source);
		if (!admin)
			throw new WsException("Source user not found");
		const room = await this.roomService.findOne(payload.room);
		if (!room)
			throw new WsException("Room not found");
		if (await this.roomService.getRole(room, admin.id) == "none")
			throw new WsException("Source user is not admin of the room");
		this.roomService.removePasswordToRoom(payload.room);
		this.server.emit(payload.room, { source: payload.source, target: payload.room, action: actionTypes.noPassword });
	}

	@SubscribeMessage('inviteUser')
	async inviteUser(client: Socket, payload: {roomName: string, username: string}) {
		console.log(payload);
		if (payload.roomName == null || payload.username == null)
			throw new WsException("Missing parameters");
		const user = await this.userService.findOne(payload.username);
		if (!user)
			throw new WsException("User not found");
		const room = await this.roomService.findOne(payload.roomName);
		if (!room)
			throw new WsException("Room not found");
		this.server.emit(payload.username + "OPTIONS", { source: payload.roomName, target: payload.username, action: actionTypes.invited, hasPassword: room.password != null });
	}

	@SubscribeMessage('joinPrivateRoom')
	async joinPrivateRoom(client: Socket, payload: {roomName: string, username: string}) {
		if (payload.roomName == null || payload.username == null)
			throw new WsException("Missing parameters");
		const user = await this.userService.findOne(payload.username);
		if (!user)
			throw new WsException("User not found");
		await this.roomService.addUser(payload.roomName, user, true);
		this.server.emit(payload.roomName, { source: payload.username, target: payload.roomName, action: actionTypes.join })
	}

	@SubscribeMessage('game')
	async handleGame(client: Socket, payload: {player: string, opponent: string, y: number})
	{
		console.log(payload);
        console.log("receive");
	}

	async afterInit(server: Server) {
		console.log('Init');
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}
}

