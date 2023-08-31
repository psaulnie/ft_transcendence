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
import { UsersService } from 'src/users/users.service';

import { manageRoomsArgs, sendMsgArgs, actionArgs } from './args.interface';
import { actionTypes, sendMsgTypes } from './args.types';
import { subscribe } from 'diagnostics_channel';
import { match } from 'assert';
import { SELF_DECLARED_DEPS_METADATA } from '@nestjs/common/constants';
import { accessStatus, userRole } from 'src/chatModule/chatEnums';
import { UseGuards } from '@nestjs/common';
import { hashPassword, comparePassword } from './hashPasswords';
import { UsersStatusService } from 'src/services/users.status.service';
import { userStatus } from 'src/users/userStatus';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/gateway',
})
export class Gateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	private matchmakingQueue: (string)[];

	constructor(
		private roomService: RoomService,
		private userService: UsersService,
    private usersStatusService: UsersStatusService,
	) {
		this.matchmakingQueue = [];
	}
	@WebSocketServer() server: Server;

  @SubscribeMessage('sendPrivateMsg')
  async sendPrivateMessage(client: Socket, payload: sendMsgArgs) {
    if (
      payload.data == null ||
      payload.source == null ||
      payload.target == null ||
      payload.type == null
    )
      throw new WsException('Missing parameter');
    if (payload.data.length > 50) payload.data = payload.data.slice(0, 50);
    const user = await this.userService.findOne(payload.source);
    console.log('sendprivmsg');
    if (!user) throw new WsException('Source user not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException('Target user not found');
    if (
      targetUser.blockedUsers.some(
        (blockedUser) => blockedUser.blockedUser.uid === user.uid,
      )
    ) {
      this.server.emit(payload.source + 'OPTIONS', {
        source: payload.source,
        target: payload.target,
        action: actionTypes.blockedmsg,
      });
      throw new WsException('Target user blocked source user');
    }
    this.server.emit(payload.target, {
      source: payload.source,
      target: payload.target,
      action: actionTypes.msg,
      data: payload.data,
      isDirectMessage: true,
      role: userRole.none,
    });
  }

  @SubscribeMessage('sendMsg')
  async sendMsg(client: Socket, payload: sendMsgArgs) {
    if (
      payload.data == null ||
      payload.source == null ||
      payload.target == null ||
      payload.type == null
    )
      throw new WsException('Missing parameter');
    if (payload.data.length > 50) payload.data = payload.data.slice(0, 50);
    const user = await this.userService.findOne(payload.source);
    console.log('sendmsg');
    if (!user) throw new WsException('Source user not found');
    const room = await this.roomService.findOne(payload.target);
    if (!room) throw new WsException('Room not found');
    if (!room.usersList.find((tmpUser) => tmpUser.user.uid === user.uid))
      throw new WsException('User not in room');
    let role = await this.roomService.getRole(room, user.uid);
    if (!role) role = userRole.none;
    this.server.emit(payload.target, {
      source: payload.source,
      target: payload.target,
      action: actionTypes.msg,
      data: payload.data,
      isDirectMessage: false,
      role: role,
    });
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, payload: any) {
    if (
      payload.access == null ||
      payload.room == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    if (payload.access == accessStatus.protected && payload.password == null)
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException('Source user not found');
    let hasPassword = false;
    let role = userRole.none;
    if (payload.room.length > 10) payload.room = payload.room.slice(0, 10);

    // If room doesn't exist
    if ((await this.roomService.findOne(payload.room)) == null) {
      if (payload.access != accessStatus.protected)
        await this.roomService.createRoom(
          payload.room,
          user,
          payload.access,
          '',
        );
      else {
        hasPassword = true;
        const hashedPassword = await hashPassword(payload.password);
        await this.roomService.createRoom(
          payload.room,
          user,
          payload.access,
          hashedPassword,
        );
      }
      role = userRole.owner;
    } else {
      // If room exists
      if (payload.access == accessStatus.protected) {
        const roomPassword = await this.roomService.getPassword(payload.room);
        if (!(await comparePassword(payload.password, roomPassword))) {
          this.server.emit(payload.source + 'OPTIONS', {
            source: payload.source,
            target: payload.room,
            action: actionTypes.wrongpassword,
          });
          return;
        }
        hasPassword = true;
      }
      const nbr = await this.roomService.addUser(payload.room, user, false);
      if (nbr == -1) {
        this.server.emit(payload.source + 'OPTIONS', {
          source: payload.source,
          target: payload.room,
          action: actionTypes.ban,
        });
        return;
      }
      if (nbr == accessStatus.private) {
        this.server.emit(payload.source + 'OPTIONS', {
          source: payload.source,
          target: payload.room,
          action: actionTypes.private,
        });
        return;
      }
    }
    if (this.roomService.isMuted(payload.room, user))
      this.server.emit(payload.room, {
        source: payload.source,
        target: payload.room,
        action: actionTypes.join,
      });
    else
      this.server.emit(payload.source + 'OPTIONS', {
        source: payload.source,
        target: payload.room,
        action: actionTypes.mute,
      });
    if (hasPassword == true)
      this.server.emit(payload.source + 'OPTIONS', {
        source: payload.source,
        target: payload.room,
        action: actionTypes.rightpassword,
        role: role,
      });
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(client: Socket, payload: any) {
    if (
      payload.access == null ||
      payload.room == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException('Source user not found');
    await this.roomService.removeUser(payload.room, user.uid);
    this.server.emit(payload.room, {
      source: payload.source,
      target: payload.room,
      action: actionTypes.left,
    });
  }

  @SubscribeMessage('openPrivateMessage')
  async openPrivateMessage(client: Socket, payload: any) {
    if (
      payload.access == null ||
      payload.room == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    if (payload.access == accessStatus.protected && payload.password == null)
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException('Source user not found');
    if (payload.room.length > 10) payload.room = payload.room.slice(0, 10);
    this.server.emit(payload.room, {
      source: payload.source,
      target: payload.room,
      action: actionTypes.privmsg,
    });
  }

  @SubscribeMessage('kick')
  async kickUser(client: Socket, payload: actionArgs) {
    if (
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (!user) throw new WsException('Target user not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    const isInRoom = room.usersList.find(
      (tmpUser) => tmpUser.user.uid === user.uid,
    );
    if (!isInRoom) throw new WsException('User not in room');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.removeUser(payload.room, user.uid);
    this.server.emit(payload.room, {
      source: payload.target,
      target: payload.room,
      action: actionTypes.left,
    });
    this.server.emit(payload.target + 'OPTIONS', {
      source: payload.source,
      target: payload.room,
      action: actionTypes.kick,
      role: userRole.none,
    });
  }

  @SubscribeMessage('ban')
  async banUser(client: Socket, payload: actionArgs) {
    if (
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (!user) throw new WsException('Target user not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    const isInRoom = room.usersList.find(
      (tmpUser) => tmpUser.user.uid === user.uid,
    );
    if (!isInRoom) throw new WsException('User not in room');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.addToBanList(payload.room, user);
    this.server.emit(payload.room, {
      source: payload.target,
      target: payload.room,
      action: actionTypes.left,
    });
    this.server.emit(payload.target + 'OPTIONS', {
      source: payload.source,
      target: payload.room,
      action: actionTypes.ban,
      role: userRole.none,
    });
  }

  @SubscribeMessage('block')
  async blockUser(client: Socket, payload: actionArgs) {
    if (
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    const blockedUser = await this.userService.findOne(payload.target);

    if (user == null || blockedUser == null)
      throw new WsException('User not found');
    await this.userService.blockUser(user, blockedUser);
  }

  @SubscribeMessage('unblock')
  async unblockUser(client: Socket, payload: actionArgs) {
    if (
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    const blockedUser = await this.userService.findOne(payload.target);

    if (user == null || blockedUser == null)
      throw new WsException('User not found');
    await this.userService.unblockUser(user, blockedUser);
  }

  @SubscribeMessage('admin')
  async addAdmin(client: Socket, payload: actionArgs) {
    if (
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (user == null) throw new WsException('User not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.addAdmin(payload.room, user);
    this.server.emit(payload.target + 'OPTIONS', {
      source: payload.room,
      target: payload.target,
      action: actionTypes.admin,
      role: userRole.admin,
    });
  }

  @SubscribeMessage('mute')
  async muteUser(client: Socket, payload: actionArgs) {
    if (
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (user == null) throw new WsException('User not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.addToMutedList(payload.room, user);
    this.server.emit(payload.target + 'OPTIONS', {
      source: payload.room,
      target: payload.target,
      action: actionTypes.mute,
      role: userRole.none,
    });
  }

  @SubscribeMessage('unmute')
  async unmuteUser(client: Socket, payload: actionArgs) {
    if (
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);

    if (user == null) throw new WsException('User not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.removeFromMutedList(payload.room, user);
    this.server.emit(payload.target + 'OPTIONS', {
      source: payload.room,
      target: payload.target,
      action: actionTypes.unmute,
      role: userRole.none,
    });
  }

  @SubscribeMessage('setPasswordToRoom')
  async setPasswordToRoom(
    client: Socket,
    payload: { room: string; password: string; source: string },
  ) {
    if (
      payload.room == null ||
      payload.password == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    console.log('setPasswordToRoom');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.setPasswordToRoom(
      payload.room,
      await hashPassword(payload.password),
    );
    this.server.emit(payload.room, {
      source: payload.room,
      target: payload.room,
      action: actionTypes.hasPassword,
    });
  }

  @SubscribeMessage('removePasswordToRoom')
  async removePasswordToRoom(
    client: Socket,
    payload: { room: string; source: string },
  ) {
    if (payload.room == null || payload.source == null)
      throw new WsException('Missing parameter');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.removePasswordToRoom(payload.room);
    this.server.emit(payload.room, {
      source: payload.source,
      target: payload.room,
      action: actionTypes.noPassword,
    });
  }

  @SubscribeMessage('inviteUser')
  async inviteUser(
    client: Socket,
    payload: { roomName: string; username: string },
  ) {
    console.log(payload);
    if (payload.roomName == null || payload.username == null)
      throw new WsException('Missing parameters');
    const user = await this.userService.findOne(payload.username);
    if (!user) throw new WsException('User not found');
    const room = await this.roomService.findOne(payload.roomName);
    if (!room) throw new WsException('Room not found');
    this.server.emit(payload.username + 'OPTIONS', {
      source: payload.roomName,
      target: payload.username,
      action: actionTypes.invited,
      hasPassword: room.password != null,
    });
  }

  @SubscribeMessage('joinPrivateRoom')
  async joinPrivateRoom(
    client: Socket,
    payload: { roomName: string; username: string },
  ) {
    if (payload.roomName == null || payload.username == null)
      throw new WsException('Missing parameters');
    const user = await this.userService.findOne(payload.username);
    if (!user) throw new WsException('User not found');
    await this.roomService.addUser(payload.roomName, user, true);
    this.server.emit(payload.roomName, {
      source: payload.username,
      target: payload.roomName,
      action: actionTypes.join,
    });
  }

	@SubscribeMessage('matchmaking')
	async hangleMatchmaking(client: Socket, payload: {username: string}) {
		// const user = await this.userService.findOne(payload.username);
		// if (!user)
		// throw new WsException("User not found");
		if (this.matchmakingQueue.find((name:string) => name == payload.username))
			throw new WsException("Already in Matchmaking");
		this.matchmakingQueue.push(payload.username);
		while (this.matchmakingQueue.length >= 2) {
				const player1 = this.matchmakingQueue[0];
				const player2 = this.matchmakingQueue[1];
				this.server.emit("matchmaking" + player1, {opponent: player2});
				this.server.emit("matchmaking" + player2, {opponent: player1});
				this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(player1), 1);
				this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(player2), 1);
		}
	}

	@SubscribeMessage('cancelMatchmaking')
	async cancelMatchmaking(client: Socket, payload: {username: string}) {
		// const user = await this.userService.findOne(payload.username);
		// if (!user)
		// throw new WsException("User not found");
		if (this.matchmakingQueue.find((name:string) => name != payload.username))
			throw new WsException("Player not in Matchmaking");
		this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(payload.username), 1);
	}

	@SubscribeMessage('game')
	async handleGame(client: Socket, payload: {player: string, opponent: string, y: number})
	{
		console.log(payload);
        console.log("receive");
		this.server.emit(payload.opponent, {mouseY: payload.y})
	}

  async afterInit(server: Server) {
    console.log('Init');
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    await this.usersStatusService.setUserStatus(client.id, userStatus.offline);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // const user = await this.userService.findOneByAccessToken(client.handshake.auth.token);
    // if (!user)
    //   return ;
    //   // throw new WsException('User not found');
    // await this.usersStatusService.addUser(client.id, client.handshake.auth.token, user.username, userStatus.online);
  }
}
