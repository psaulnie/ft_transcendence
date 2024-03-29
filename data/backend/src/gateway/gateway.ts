import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/services/room.service';
import { UsersService } from 'src/users/users.service';

import { actionArgs, sendMsgArgs } from './args.interface';
import { actionTypes } from './args.types';
import { accessStatus, userRole } from 'src/chatModule/chatEnums';
import { comparePassword, hashPassword } from './hashPasswords';
import { UsersStatusService } from 'src/services/users.status.service';
import { userStatus } from 'src/users/userStatus';
import { GameService } from 'src/services/game.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/gateway',
  connectionStateRecovery: {
    maxDisconnectionDuration: 10000, //10 secondes
    skipMiddlewares: true,
  },
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private matchmakingQueue: string[];
  private invitedChat: Array<{ id: string; value: string }>;
  private invitedPong: Array<{ id: string; value: string }>;
  private askFriend: Array<{ id: string; value: string }>;
  private readonly maxScore: number;

  constructor(
    private roomService: RoomService,
    private userService: UsersService,
    private usersStatusService: UsersStatusService,
    private gameService: GameService,
  ) {
    this.matchmakingQueue = [];
    this.invitedChat = [];
    this.invitedPong = [];
    this.askFriend = [];
    this.maxScore = 5;
  }

  @SubscribeMessage('joinPrivateMsg')
  async joinPrivateMsg(client: Socket, payload: string) {
    if (!payload) throw new WsException('Missing parameter');
    const cUser = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (!cUser) throw new WsException('Forbidden');
    const user = await this.userService.findOne(cUser.username);
    if (!user) throw new WsException('Forbidden');
    const targetUser = await this.userService.findOne(payload);
    if (!targetUser) throw new WsException(payload + ' not found');
    this.server.emit(cUser.username + 'GETUID', {
      listener:
        user.uid > targetUser.uid
          ? user.uid + '' + targetUser.uid
          : targetUser.uid + '' + user.uid,
      name: payload + '⌲',
    });
  }

  @SubscribeMessage('sendPrivateMsg')
  async sendPrivateMessage(client: Socket, payload: sendMsgArgs) {
    if (
      !payload ||
      payload.data == null ||
      payload.source == null ||
      payload.target == null ||
      payload.type == null
    )
      throw new WsException('Missing parameter');
    if (payload.data.length > 50) payload.data = payload.data.slice(0, 50);
    payload.target = payload.target.slice(0, -1);
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException(payload.source + ' not found');
    const cUserStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!cUserStatus || cUserStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException(payload.target + ' not found');
    if (
      targetUser.blockedUsers.some(
        (blockedUser) => blockedUser.blockedUser.uid === user.uid,
      )
    ) {
      this.server.emit(client.id, {
        source: payload.source,
        target: payload.target,
        action: actionTypes.blockedmsg,
      });
      throw new WsException(payload.target + ' blocked you');
    }
    const targetStatus = await this.usersStatusService.getUserStatus(
      targetUser.username,
    );
    if (!targetStatus || targetStatus.status === userStatus.offline) {
      throw new WsException(targetUser.username + ' is offline');
    }
    const listener =
      user.uid > targetUser.uid
        ? user.uid + '' + targetUser.uid
        : targetUser.uid + '' + user.uid;
    client.join(listener + '⌲');
    targetStatus.client.join(listener + '⌲');
    this.server.to(payload.target + '⌲').emit(payload.target + '⌲', {
      source: payload.source,
      target: payload.target,
      listener: listener + '⌲',
      action: actionTypes.msg,
      data: payload.data,
      isDirectMessage: true,
      role: userRole.none,
    });
  }

  @SubscribeMessage('sendMsg')
  async sendMsg(client: Socket, payload: sendMsgArgs) {
    if (
      !payload ||
      payload.data == null ||
      payload.source == null ||
      payload.target == null ||
      payload.type == null
    )
      throw new WsException('Missing parameter');
    if (payload.data.length > 50) payload.data = payload.data.slice(0, 50);
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.target);
    if (!room) throw new WsException('Room not found');
    const cUser = room.usersList.find(
      (tmpUser) => tmpUser.user.uid === user.uid,
    );
    if (!cUser) throw new WsException("You're not in that room");
    if (cUser.isBanned) throw new WsException("You're banned from that room");
    else if (cUser.isMuted) throw new WsException("You're muted in that room");
    let role = await this.roomService.getRole(room, user.uid);
    if (!role) role = userRole.none;
    this.server.to(payload.target).emit(payload.target, {
      source: payload.source,
      target: payload.target,
      action: actionTypes.msg,
      data: payload.data,
      isDirectMessage: false,
      role: role,
    });
  }

  @SubscribeMessage('createRoom')
  async createRoom(client: Socket, payload: any) {
    if (
      !payload ||
      payload.access == null ||
      payload.room == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const newName = payload.room.replace(/[^a-z0-9]/gi, '');
    if (newName !== payload.room)
      throw new WsException('Room name must be alphanumeric');
    if (payload.room.length < 1) throw new WsException('Room name too short');
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException(payload.source + ' not found');
    if (await this.roomService.isUserInRoom(payload.room, user.uid))
      throw new WsException("You're already in that room");
    const roomsJoined = await this.roomService.findAllRoomUserNumber(payload.source);
    if (roomsJoined >= 15)
      throw new WsException(
        'You joined too many channels, leave some before creating a new one',
      );
    const room = await this.roomService.findOne(payload.room);
    if (!room) await this.joinRoom(client, payload);
    else
      this.server.emit(client.id, {
        action: actionTypes.roomAlreadyExist,
        target: payload.room,
      });
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, payload: any) {
    if (
      !payload ||
      payload.access == null ||
      payload.room == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    if (payload.room.length < 1) throw new WsException('Room name too short');
    if (payload.room.length > 10) payload.room = payload.room.slice(0, 10);
    const newName = payload.room.replace(/[^a-z0-9]/gi, '');
    if (newName !== payload.room)
      throw new WsException('Room name must be alphanumeric');
    if (payload.access == accessStatus.protected && payload.password == null)
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    if (await this.roomService.isUserBanned(payload.room, user.uid))
      throw new WsException("You're banned from that room");
    if (await this.roomService.isUserInRoom(payload.room, user.uid))
      throw new WsException("You're already in that room");
    const roomsJoined = await this.roomService.findAllRoomUserNumber(payload.source);
    if (roomsJoined >= 15)
      throw new WsException(
        'You joined too many channels, leave some before joining a new one',
      );
    let hasPassword = false;
    let role = userRole.none;
    if (payload.room.length > 10) payload.room = payload.room.slice(0, 10);
    // If room doesn't exist
    const room = await this.roomService.findOne(payload.room);
    if (!room) {
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
      if (room.access == accessStatus.protected) {
        const roomPassword = await this.roomService.getPassword(payload.room);
        if (!(await comparePassword(payload.password, roomPassword))) {
          this.server.emit(client.id, {
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
        this.server.emit(client.id, {
          source: payload.source,
          target: payload.room,
          action: actionTypes.ban,
        });
        return;
      }
      if (nbr == accessStatus.private) {
        this.server.emit(client.id, {
          source: payload.source,
          target: payload.room,
          action: actionTypes.private,
        });
        return;
      }
    }
    client.join(payload.room);
    this.server.emit(client.id, {
      action: actionTypes.joinRoom,
      target: payload.room,
      hasPassword: hasPassword,
      role: role,
    });
    this.server.to(payload.room).emit(payload.room, {
      source: payload.source,
      target: payload.room,
      action: actionTypes.join,
    });
    if (hasPassword == true)
      this.server.emit(client.id, {
        source: payload.source,
        target: payload.room,
        action: actionTypes.rightpassword,
        role: role,
      });
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(client: Socket, payload: any) {
    if (
      !payload ||
      payload.access == null ||
      payload.room == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException(payload.source + ' not found');
    const room = await this.roomService.findOne(payload.room);
    if (!room) return;
    const previousOwner = room.owner.uid;
    if (await this.roomService.isUserInRoom(payload.room, user.uid) === false)
      throw new WsException("You're not in that room");
    const owner = await this.roomService.removeUser(room, user.uid);
    const ownerStatus = await this.usersStatusService.getUserStatus(
      owner?.username,
    );
    if (
      ownerStatus &&
      ownerStatus.username === owner.username &&
      previousOwner !== owner.uid
    ) {
      this.server.emit(ownerStatus.clientId, {
        source: payload.room,
        action: actionTypes.owner,
      });
    }
    client.leave(payload.room);
    this.server.to(payload.room).emit(payload.room, {
      source: payload.source,
      target: payload.room,
      action: actionTypes.left,
    });
  }

  @SubscribeMessage('openPrivateMessage')
  async openPrivateMessage(client: Socket, payload: any) {
    if (
      !payload ||
      payload.access == null ||
      payload.room == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    if (payload.access == accessStatus.protected && payload.password == null)
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    if (!user) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
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
      !payload ||
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (!user) throw new WsException(payload.target + ' not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    const isInRoom = room.usersList.find(
      (tmpUser) => tmpUser.user.uid === user.uid,
    );
    if (!isInRoom) throw new WsException("You're not in that room");
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException("You're not an admin of this room");
    if (room.owner.username === payload.target) throw new WsException('You cannot kick the owner');
    await this.roomService.removeUser(room, user.uid);
    this.server.to(payload.room).emit(payload.room, {
      source: payload.target,
      target: payload.room,
      action: actionTypes.left,
    });
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    if (!targetStatus) return;
    targetStatus.client.leave(payload.room);
    this.server.to(targetStatus.clientId).emit(targetStatus.clientId, {
      source: payload.source,
      target: payload.room,
      action: actionTypes.kick,
      role: userRole.none,
    });
  }

  @SubscribeMessage('ban')
  async banUser(client: Socket, payload: actionArgs) {
    if (
      !payload ||
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (!user) throw new WsException(payload.target + ' not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    const isInRoom = room.usersList.find(
      (tmpUser) => tmpUser.user.uid === user.uid,
    );
    if (!isInRoom) throw new WsException("You're not in that room");
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException("You're not an admin of this room");
    if (room.owner.username === payload.target) throw new WsException('You cannot kick the owner');
    await this.roomService.addToBanList(payload.room, user);
    this.server.emit(payload.room, {
      source: payload.target,
      target: payload.room,
      action: actionTypes.left,
    });
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    if (!targetStatus) return;
    targetStatus.client.leave(payload.room);
    this.server.emit(targetStatus.clientId, {
      source: payload.source,
      target: payload.room,
      action: actionTypes.ban,
      role: userRole.none,
    });
  }

  @SubscribeMessage('unban')
  async unbanUser(
    client: Socket,
    payload: { roomName: string; username: string },
  ) {
    if (!payload || !payload.roomName || !payload.username)
      throw new WsException('Missing parameters');
    const ownerStatus = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (!ownerStatus) throw new WsException('Forbidden');
    const owner = await this.userService.findOne(ownerStatus.username);
    if (!owner) throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.roomName);
    if (!room) throw new WsException('Room not found');
    if (room.owner.uid !== owner.uid) throw new WsException('Forbidden');
    const user = await this.usersStatusService.getUserStatus(payload.username);
    if (!user) throw new WsException(payload.username + ' not found');
    const bannedUser = await this.userService.findOne(payload.username);
    if (!bannedUser) throw new WsException(payload.username + ' not found');
    await this.roomService.unban(payload.roomName, bannedUser);
    this.server.emit(user.clientId, {
      action: actionTypes.unban,
      target: payload.roomName,
    });
    this.server.emit(ownerStatus.clientId, {
      action: actionTypes.beenUnbanned,
      target: payload.username,
    });
  }

  @SubscribeMessage('block')
  async blockUser(client: Socket, payload: actionArgs) {
    if (!payload || payload.source == null || payload.target == null)
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    const blockedUser = await this.userService.findOne(payload.target);

    if (!user) throw new WsException(payload.source + ' not found');
    else if (!blockedUser) throw new WsException(payload.target + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    if (!(await this.userService.blockUser(user, blockedUser)))
      throw new WsException('Already blocked');
    await this.removeFriend(client, payload);
  }

  @SubscribeMessage('unblock')
  async unblockUser(client: Socket, payload: actionArgs) {
    if (!payload || payload.source == null || payload.target == null)
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.source);
    const blockedUser = await this.userService.findOne(payload.target);

    if (!user) throw new WsException(payload.source + ' not found');
    else if (!blockedUser) throw new WsException(payload.target + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    if (user.blockedUsers.find((obj) => obj.user.username === payload.target))
      throw new WsException('Not blocked');
    await this.userService.unblockUser(user, blockedUser);
  }

  @SubscribeMessage('admin')
  async addAdmin(client: Socket, payload: actionArgs) {
    if (
      !payload ||
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (user == null) throw new WsException(payload.target + ' not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException("You're not an admin of this room");
    await this.roomService.addAdmin(payload.room, user);
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    if (!targetStatus) return;
    this.server.emit(targetStatus.clientId, {
      source: payload.room,
      target: payload.target,
      action: actionTypes.admin,
      role: userRole.admin,
    });
  }

  @SubscribeMessage('mute')
  async muteUser(client: Socket, payload: actionArgs) {
    if (
      !payload ||
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (user == null) throw new WsException(payload.target + ' not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException("You're not an admin of this room");
    if (room.owner.username === payload.target) throw new WsException('You cannot kick the owner');
    await this.roomService.addToMutedList(payload.room, user);
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    if (!targetStatus) return;
    this.server.emit(targetStatus.clientId, {
      source: payload.room,
      target: payload.target,
      action: actionTypes.mute,
      role: userRole.none,
    });
  }

  @SubscribeMessage('unmute')
  async unmuteUser(client: Socket, payload: actionArgs) {
    if (
      !payload ||
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);

    if (user == null) throw new WsException(payload.target + ' not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException("You're not an admin of this room");
    if (room.owner.username === payload.target) throw new WsException('You cannot kick the owner');
    await this.roomService.removeFromMutedList(payload.room, user);
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    if (!targetStatus) return;
    this.server.emit(targetStatus.clientId, {
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
      !payload ||
      payload.room == null ||
      payload.password == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException(payload.source + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException("You're not an admin of this room");
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
    if (!payload || payload.room == null || payload.source == null)
      throw new WsException('Missing parameter');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException("You're not an admin of this room");
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
    payload: { roomName: string; username: string; source: string },
  ) {
    if (
      !payload ||
      payload.roomName == null ||
      payload.username == null ||
      payload.source == null
    )
      throw new WsException('Missing parameters');
    const user = await this.userService.findOne(payload.username);
    if (!user) throw new WsException(payload.username + ' not found');
    const cUserStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!cUserStatus || cUserStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const invitedUserStatus = await this.usersStatusService.getUserStatus(
      payload.username,
    );
    if (!invitedUserStatus || invitedUserStatus.status === userStatus.offline)
      throw new WsException(payload.username + ' is offline');
    const room = await this.roomService.findOne(payload.roomName);
    if (!room) throw new WsException('Room not found');
    this.invitedChat.push({
      id: invitedUserStatus.clientId,
      value: payload.roomName,
    });
    this.server.emit(invitedUserStatus.clientId, {
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
    if (!payload || payload.roomName == null || payload.username == null)
      throw new WsException('Missing parameters');
    if (
      !this.invitedChat.find(
        (obj) => obj.id === client.id && obj.value === payload.roomName,
      )
    )
      throw new WsException('Forbidden');
    const index = this.invitedChat.findIndex(
      (obj) => obj.id === client.id && obj.value === payload.roomName,
    );
    this.invitedChat.slice(index, 1);
    const user = await this.userService.findOne(payload.username);
    if (!user) throw new WsException(payload.username + ' not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.username,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    if (await this.roomService.isUserInRoom(payload.roomName, user.uid))
      throw new WsException('You\'re already in that room');
    await this.roomService.addUser(payload.roomName, user, true);
    userStatus.client.join(payload.roomName);
    this.server.emit(payload.roomName, {
      source: payload.username,
      target: payload.roomName,
      action: actionTypes.join,
    });
  }

  @SubscribeMessage('askBeingFriend')
  async askBeingFriend(
    client: Socket,
    payload: { source: string; target: string },
  ) {
    if (!payload || payload.source == null || payload.target == null)
      throw new WsException('Missing parameters');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException(payload.source + ' not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException(payload.target + ' not found');
    if (
      sourceUser.friends.some((friend) => friend.uid === targetUser.uid) &&
      targetUser.friends.some((friend) => friend.uid === sourceUser.uid)
    )
      throw new WsException('Already friends');
    if (
      targetUser.blockedUsers.some(
        (blockedUser) => blockedUser.blockedUser.uid === sourceUser.uid,
      )
    )
      throw new WsException(payload.target + ' blocked you');
    if (
      sourceUser.blockedUsers.some(
        (blockedUser) => blockedUser.blockedUser.uid === targetUser.uid,
      )
    )
      throw new WsException('You blocked ' + payload.target);
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    if (!targetStatus) throw new WsException(payload.target + ' not found');
    this.askFriend.push({ id: targetStatus.clientId, value: payload.source });
    this.server.emit(targetStatus.clientId, {
      source: payload.source,
      target: payload.target,
      action: actionTypes.askBeingFriend,
    });
  }

  @SubscribeMessage('acceptBeingFriend')
  async acceptBeingFriend(
    client: Socket,
    payload: { source: string; target: string },
  ) {
    if (!payload || payload.source == null || payload.target == null)
      throw new WsException('Missing parameters');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    if (
      !this.askFriend.find(
        (obj) => obj.id === client.id && obj.value === payload.target,
      )
    )
      throw new WsException(payload.target + ' didn\'t ask you to be friend');
    const index = this.askFriend.findIndex(
      (obj) => obj.id === client.id && obj.value === payload.target,
    );
    this.askFriend.slice(index, 1);
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException(payload.source + ' not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException(payload.target + ' not found');
    const targetStatus = await this.usersStatusService.getUserStatus(
      targetUser.username,
    );
    if (!targetStatus) throw new WsException(payload.target + ' not found');
    if (
      sourceUser.friends.some((friend) => friend.uid === targetUser.uid) &&
      targetUser.friends.some((friend) => friend.uid === sourceUser.uid)
    )
      throw new WsException('Already friends');
    if (
      targetUser.blockedUsers.some(
        (blockedUser) => blockedUser.blockedUser.uid === sourceUser.uid,
      )
    )
      throw new WsException(payload.target + ' blocked you');
    if (
      sourceUser.blockedUsers.some(
        (blockedUser) => blockedUser.blockedUser.uid === targetUser.uid,
      )
    )
      throw new WsException('You blocked ' + payload.target);
    await this.userService.addFriend(sourceUser, targetUser);
    this.server.emit(targetStatus.clientId, {
      source: payload.source,
      action: actionTypes.acceptBeingFriend,
    });
    this.server.emit(targetStatus.clientId + 'friend');
    this.server.emit(client.id + 'friend');
  }

  @SubscribeMessage('removeFriend')
  async removeFriend(
    client: Socket,
    payload: { source: string; target: string },
  ) {
    if (!payload || payload.source == null || payload.target == null)
      throw new WsException('Missing parameters');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException(payload.source + ' not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException(payload.target + ' not found');
    await this.userService.removeFriend(sourceUser, targetUser);
    const targetStatus = await this.usersStatusService.getUserStatus(
      targetUser.username,
    );
    if (targetStatus) this.server.emit(targetStatus.clientId + 'friend');
    this.server.emit(client.id + 'friend');
  }

  /*
----------------------------GAME---------------------------------
*/

  @SubscribeMessage('askPlayPong')
  async askPlayPong(client: Socket, payload: string) {
    if (!payload) throw new WsException('Missing parameters');
    const cUserStatus = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (!cUserStatus) throw new WsException('Forbidden');
    const user = await this.userService.findOne(cUserStatus.username);
    if (!user) throw new WsException(cUserStatus.username + ' not found');
    const invitedUserStatus = await this.usersStatusService.getUserStatus(
      payload,
    );
    if (!invitedUserStatus || invitedUserStatus.status !== userStatus.online) {
      this.server.emit(client.id, {
        action: actionTypes.cantPlay,
        target: payload,
        data: !invitedUserStatus
          ? userStatus.offline
          : invitedUserStatus.status,
      });
      return;
    }
    this.invitedPong.push({
      id: invitedUserStatus.clientId,
      value: cUserStatus.username,
    });
    this.server.emit(invitedUserStatus.clientId, {
      action: actionTypes.askPlay,
      source: cUserStatus.username,
    });
  }

  @SubscribeMessage('acceptPlayPong')
  async acceptPlayPong(client: Socket, payload: string) {
    if (!payload) throw new WsException('Missing parameters');
    const cUserStatus = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (!cUserStatus) throw new WsException('Forbidden');
    if (
      !this.invitedPong.find(
        (obj) => obj.id === client.id && obj.value === payload,
      )
    ) {
        throw  new WsException(payload + ' is already playing');
    }
    this.invitedPong = this.invitedPong.filter(
      (obj) => obj.id !== client.id && obj.value !== payload,
    );
    const user = await this.userService.findOne(cUserStatus.username);
    if (!user) throw new WsException(cUserStatus.username + ' not found');
    const opponentStatus = await this.usersStatusService.getUserStatus(payload);
    if (!opponentStatus)
      throw new WsException(payload + ' not found or offline');
    if (cUserStatus.status === userStatus.playing)
      throw new WsException(cUserStatus.username + ' is already in game');
    if (opponentStatus.status === userStatus.playing)
    throw new WsException(opponentStatus.username + ' is already in game');      
    const user1 = await this.userService.findOne(cUserStatus.username);
    const user2 = await this.userService.findOne(opponentStatus.username);
    if (!user1 || !user2) throw new WsException('Users not found');
    const gameRoomId =
      cUserStatus.username < opponentStatus.username
        ? this.gameService.newGame(user1, user2)
        : this.gameService.newGame(user2, user1);
    this.matchmakingQueue.splice(
      this.matchmakingQueue.indexOf(cUserStatus.username),
      1,
    );
    this.matchmakingQueue.splice(
      this.matchmakingQueue.indexOf(opponentStatus.username),
      1,
    );
    cUserStatus.status = userStatus.playing;
    cUserStatus.gameRoomId = gameRoomId;
    opponentStatus.status = userStatus.playing;
    opponentStatus.gameRoomId = gameRoomId;
    this.server.emit(opponentStatus.clientId, {
      action: actionTypes.acceptPlay,
      source: opponentStatus.username,
      target: cUserStatus.username,
      data: {
        gameRoomId,
        background: user2.gameBackground,
      },
    });
    this.server.emit(cUserStatus.clientId, {
      action: actionTypes.acceptPlay,
      source: cUserStatus.username,
      target: opponentStatus.username,
      data: {
        gameRoomId,
        background: user1.gameBackground,
      },
    });
    const gameRoom = this.gameService.getGameRoom(gameRoomId);
    if (!gameRoom) return;
    gameRoom.intervalId = setInterval(() => {
      if (
        gameRoom.player1.score === this.maxScore ||
        gameRoom.player2.score === this.maxScore
      ) {
        clearInterval(gameRoom.intervalId);
        this.endGame(client, { gameRoomId });
      }
      this.gameService.movePlayer(gameRoomId, false);
      this.gameService.movePlayer(gameRoomId, true);
      this.gameService.moveBall(gameRoomId);
      this.server.emit('game' + gameRoomId, {
        playerY: gameRoom.player1.Y,
        enemyY: gameRoom.player2.Y,
        ballX: gameRoom.ballPos.x,
        ballY: gameRoom.ballPos.y,
        p1Score: gameRoom.player1.score,
        p2Score: gameRoom.player2.score,
        coward: gameRoom.coward,
      });
    }, 16);
  }

  @SubscribeMessage('matchmaking')
  async handleMatchmaking(client: Socket, payload: { username: string }) {
    if (!payload || !payload.username)
      throw new WsException('Missing parameters');
    const userStatusTmp = await this.usersStatusService.getUserStatus(
      payload.username,
    );
    if (!userStatusTmp || userStatusTmp.clientId !== client.id)
      throw new WsException('Forbidden');
    const ticServ = 16;
    if (this.matchmakingQueue.find((name: string) => name == payload.username))
      throw new WsException('Already in Matchmaking');
    this.matchmakingQueue.push(payload.username);
    while (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue[0];
      const player2 = this.matchmakingQueue[1];
      const user1 = await this.userService.findOne(player1);
      const user2 = await this.userService.findOne(player2);
      if (!user1 || !user2) throw new WsException('Users not found');
      const gameRoomId =
        player1 < player2
          ? this.gameService.newGame(user1, user2)
          : this.gameService.newGame(user2, user1);
      const user1Status = await this.usersStatusService.getUserStatus(player1);
      if (!user1Status) return;
      user1Status.status = userStatus.playing;
      user1Status.gameRoomId = gameRoomId;
      const user2Status = await this.usersStatusService.getUserStatus(player2);
      if (!user2Status) return;
      user2Status.status = userStatus.playing;
      user2Status.gameRoomId = gameRoomId;
      this.server.emit('matchmaking' + player1, {
        opponent: player2,
        gameRoomId: gameRoomId,
        background: user1.gameBackground,
      });
      this.server.emit('matchmaking' + player2, {
        opponent: player1,
        gameRoomId: gameRoomId,
        background: user2.gameBackground,
      });
      this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(player1), 1);
      this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(player2), 1);
      const gameRoom = this.gameService.getGameRoom(gameRoomId);
      if (!gameRoom) throw new WsException('Game Room not found');
      gameRoom.intervalId = setInterval(() => {
        if (
          (gameRoom.player1.score === this.maxScore ||
            gameRoom.player2.score === this.maxScore) &&
          gameRoom.isFinish === false
        ) {
          clearInterval(gameRoom.intervalId);
          this.endGame(client, { gameRoomId });
        }
        this.gameService.movePlayer(gameRoomId, false);
        this.gameService.movePlayer(gameRoomId, true);
        this.gameService.moveBall(gameRoomId);
        this.server.emit('game' + gameRoomId, {
          playerY: gameRoom.player1.Y,
          enemyY: gameRoom.player2.Y,
          ballX: gameRoom.ballPos.x,
          ballY: gameRoom.ballPos.y,
          p1Score: gameRoom.player1.score,
          p2Score: gameRoom.player2.score,
          coward: gameRoom.coward,
        });
      }, ticServ);
    }
  }

  async endGame(client: Socket, payload: { gameRoomId: string }) {
    if (!payload || !payload.gameRoomId) return;
    const gameRoom = this.gameService.getGameRoom(payload.gameRoomId);
    if (!gameRoom) return;
    if (gameRoom.isFinish === true) return;
    let userW;
    let userL;
    if (gameRoom.coward === null) {
      userW =
        gameRoom.player1.score === this.maxScore
          ? gameRoom.player1.user
          : gameRoom.player2.user;
      userL =
        gameRoom.player1.score === this.maxScore
          ? gameRoom.player2.user
          : gameRoom.player1.user;
    } else {
      userW =
        gameRoom.coward === gameRoom.player1.user.username
          ? gameRoom.player2.user
          : gameRoom.player1.user;
      userL =
        gameRoom.coward === gameRoom.player1.user.username
          ? gameRoom.player1.user
          : gameRoom.player2.user;
    }
    const userWStatus = await this.usersStatusService.getUserStatus(
      userW.username,
    );
    const userLStatus = await this.usersStatusService.getUserStatus(
      userL.username,
    );
    userWStatus.status = userStatus.online;
    userWStatus.gameRoomId = null;
    userLStatus.status = userStatus.online;
    userLStatus.gameRoomId = null;
    await this.gameService.addMatchHistory(payload.gameRoomId, userW, userL);
    await this.gameService.updateRank(userW, userL);
    await this.gameService.updateAchievement(userW, userL);
    gameRoom.isFinish = true;
  }

  @SubscribeMessage('leaveGame')
  async leaveGame(
    client: Socket,
    payload: { gameRoomId: string; coward: string },
  ) {
    if (!payload || !payload.gameRoomId || !payload.coward)
      throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.coward,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const gameRoom = this.gameService.getGameRoom(payload.gameRoomId);
    if (!gameRoom) throw new WsException('Game Room not found');
    gameRoom.coward = payload.coward;
    await this.gameService.leaveGame(payload.gameRoomId, payload.coward);
    await this.endGame(client, { gameRoomId: payload.gameRoomId });
  }

  @SubscribeMessage('cancelMatchmaking')
  async cancelMatchmaking(client: Socket, payload: { username: string }) {
    if (!payload || !payload.username)
      throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.username,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    if (this.matchmakingQueue.find((name: string) => name != payload.username))
      return;
    this.matchmakingQueue.splice(
      this.matchmakingQueue.indexOf(payload.username),
      1,
    );
  }

  @SubscribeMessage('pressUp')
  async pressUp(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
    if (!payload || !payload.gameRoomId || !payload.player)
      throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.player,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    this.gameService.pressUp(payload.player, payload.gameRoomId);
  }

  @SubscribeMessage('pressDown')
  async pressDown(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
    if (!payload || !payload.gameRoomId || !payload.player)
      throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.player,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    this.gameService.pressDown(payload.player, payload.gameRoomId);
  }

  @SubscribeMessage('releaseUp')
  async releaseUp(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
    if (!payload || !payload.player || !payload.gameRoomId)
      throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.player,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    this.gameService.releaseUp(payload.player, payload.gameRoomId);
  }

  @SubscribeMessage('releaseDown')
  async releaseDown(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
    if (!payload || !payload.player || !payload.gameRoomId)
      throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.player,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    this.gameService.releaseDown(payload.player, payload.gameRoomId);
  }

  @SubscribeMessage('leaveGamePage')
  async leaveGamePage(client: Socket) {
    const cUserStatus = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (!cUserStatus || cUserStatus.status !== userStatus.playing) return;
    const gameRoom = this.gameService.getGameRoom(cUserStatus.gameRoomId);
    if (!gameRoom) throw new WsException('Game Room not found');
    gameRoom.coward = cUserStatus.username;
    await this.leaveGame(client, {
      gameRoomId: cUserStatus.gameRoomId,
      coward: cUserStatus.username,
    });
  }

  /*
-----------------------------------------------------------------
*/

  @SubscribeMessage('changeUsername')
  async changeUsername(client: Socket, payload: string) {
    if (!payload) throw new WsException('Missing parameter');
    if (payload.length < 1) throw new WsException('Username too short');
    if (payload.length > 10) payload = payload.substring(0, 10);
    const newPayload = payload.replace(/[^a-z0-9]/gi, '');
    if (newPayload !== payload)
      throw new WsException('Only alpha-numeric characters allowed');
    const userStatus = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (!userStatus) throw new WsException('Forbidden');
    if (await this.userService.findOne(payload)) {
      this.server.emit(client.id, {
        action: actionTypes.usernameAlreadyTaken,
        newUsername: payload,
      });
      return;
    }
    if (userStatus.clientId !== client.id) throw new WsException('Forbidden');
    const user = await this.userService.findOne(userStatus.username);
    const oldUsername = user.username;
    if (!user) throw new WsException(userStatus + ' not found');
    await this.userService.changeUsername(user, payload);
    await this.usersStatusService.changeUsername(userStatus.username, payload);
    client.leave(oldUsername + '⌲');
    client.join(payload + '⌲');
    this.server.emit('newUsername', {
      source: oldUsername,
      target: payload,
      action: actionTypes.msg,
      isDirectMessage: true,
    });
    this.server.emit(client.id, {
      newUsername: payload,
      action: actionTypes.newUsername,
    });
  }

  @SubscribeMessage('changeBackground')
  async changeBackground(client: Socket, payload: string) {
    if (!payload) throw new WsException('Missing parameter');
    const userStatus = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (userStatus) {
      if (
        payload != 'canvas' &&
        payload != 'scooby' &&
        payload != 'roadrunner' &&
        payload != 'orange' &&
        payload != 'windows' &&
        payload != 'spongebob'
      )
        return;
      await this.userService.changeBackground(userStatus.username, payload);
      this.server.emit(client.id, { action: actionTypes.newBackground });
    } else throw new WsException('Forbidden');
  }

  async afterInit(server: Server) {
    server.on('connection', (client) => {
      client.on('disconnect', (reason) => {
        console.log(reason);
      });
    });
  }

  async handleDisconnect(client: Socket) {
    const userStatusTmp = await this.usersStatusService.getUserStatusByClientId(
      client.id,
      );
    if (!userStatusTmp) return;
    console.log('client disconnected: ', client.id, userStatusTmp.username);
    client.leave(client.id);
    client.leave(client.id + "GETUID");
    client.leave(userStatusTmp.username + '⌲');
    const user = await this.userService.findOne(userStatusTmp.username);
    if (userStatusTmp.status === userStatus.playing) {
      const gameRoom = this.gameService.getGameRoom(userStatusTmp.gameRoomId);
      if (gameRoom) {
        gameRoom.coward = userStatusTmp.username;
        const gameRoomId = userStatusTmp.gameRoomId;
        await this.leaveGame(client, {
          gameRoomId: userStatusTmp.gameRoomId,
          coward: user.username,
        });
        await this.endGame(client, { gameRoomId: gameRoomId });
      }
    }
    this.matchmakingQueue = this.matchmakingQueue.filter(
      (name: string) => name != userStatusTmp.username,
    );
    this.askFriend = this.askFriend.filter((obj) => obj.id !== client.id);
    this.invitedChat = this.invitedChat.filter((obj) => obj.id !== client.id);
    this.invitedPong = this.invitedPong.filter((obj) => obj.id !== client.id);
    await this.usersStatusService.setUserStatus(client.id, userStatus.offline);
  }

  async handleConnection(client: Socket) {
    const credential = client.handshake.headers.cookie
      ?.split(';')
      .find((cookie) => cookie.includes('connect.sid'));
    if (!credential) {
      client.disconnect();
      return;
    }
    const connectSid = credential.substring(
      credential.indexOf('s%3A') + 4,
      credential.indexOf('.', credential.indexOf('s%3A')),
    );
    const session = await this.userService.findOneSession(connectSid);
    if (!session) {
      client.disconnect();
      return;
    }
    const parsedJson = JSON.parse(session.json);
    const user = await this.userService.findOneByIntraUsername(
      parsedJson.passport.user.intraUsername,
    );
    if (!user) {
      client.disconnect();
      return;
    }
    const currentStatus = await this.usersStatusService.getUserStatus(
      user.username,
    );
    if (
      currentStatus &&
      currentStatus.status !== userStatus.offline &&
      client.id !== currentStatus.clientId
    ) {
      await this.usersStatusService.addUser(
        client.id,
        client,
        user.username,
        userStatus.offline,
      );
      if (currentStatus.status === userStatus.playing) {
        const gameRoom = this.gameService.getGameRoom(currentStatus.gameRoomId);
        if (gameRoom) {
          gameRoom.coward = currentStatus.username;
          await this.leaveGame(client, {
            gameRoomId: currentStatus.gameRoomId,
            coward: currentStatus.username,
          });
          await this.endGame(client, { gameRoomId: currentStatus.gameRoomId });
        }
      }
      currentStatus.client.disconnect();
      client.disconnect();
      this.askFriend = this.askFriend.filter((obj) => obj.id !== client.id);
      this.invitedChat = this.invitedChat.filter((obj) => obj.id !== client.id);
      this.invitedPong = this.invitedPong.filter((obj) => obj.id !== client.id);
      return;
    }
    await this.usersStatusService.addUser(
      client.id,
      client,
      user.username,
      userStatus.online,
    );
    const rooms = await this.roomService.findAllRoomUser(user.username);
    rooms.forEach(element => {
      client.join(element.roomName);
    });
    client.join(client.id);
    client.join(client.id + "GETUID");
    client.join(user.username + '⌲');
    console.log('client connected: ', client.id, user.username);
  }
}
