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

import { sendMsgArgs, actionArgs } from './args.interface';
import { actionTypes } from './args.types';
import { accessStatus, userRole } from 'src/chatModule/chatEnums';
import { hashPassword, comparePassword } from './hashPasswords';
import { UsersStatusService } from 'src/services/users.status.service';
import { userStatus } from 'src/users/userStatus';
import { GameService } from 'src/services/game.service';
import { User } from 'src/entities';
import { CannotGetEntityManagerNotConnectedError } from 'typeorm';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/gateway',
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private matchmakingQueue: string[];
  private maxScore: number;
  @WebSocketServer() server: Server;

  constructor(
    private roomService: RoomService,
    private userService: UsersService,
    private usersStatusService: UsersStatusService,
    private gameService: GameService,
  ) {
    this.matchmakingQueue = [];
    this.maxScore = 5;
  }

  @SubscribeMessage('sendPrivateMsg')
  async sendPrivateMessage(client: Socket, payload: sendMsgArgs) {
    if (
      //TODO duplicated fragment of code (9lines), try to avoid duplicates
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException('Target user not found');
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
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
    if (!(await this.roomService.isMuted(payload.room, user)))
      this.server.emit(payload.room, {
        source: payload.source,
        target: payload.room,
        action: actionTypes.join,
      });
    else
      this.server.emit(client.id, {
        source: payload.source,
        target: payload.room,
        action: actionTypes.mute,
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
    if (!user) throw new WsException('Source user not found');
    const owner = await this.roomService.removeUser(payload.room, user.uid);
    const ownerStatus = await this.usersStatusService.getUserStatus(
      owner?.username,
    );
    if (ownerStatus && ownerStatus.username === owner.username) {
      this.server.emit(ownerStatus.clientId, {
        source: payload.room,
        action: actionTypes.owner,
      });
    }
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
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (!user) throw new WsException('Target user not found');
    const admin = await this.userService.findOne(payload.source);
    if (!admin) throw new WsException('Source user not found');
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
    if (!isInRoom) throw new WsException('User not in room');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.removeUser(payload.room, user.uid);
    this.server.emit(payload.room, {
      source: payload.target,
      target: payload.room,
      action: actionTypes.left,
    });
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    this.server.emit(targetStatus.clientId, {
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
    if (!isInRoom) throw new WsException('User not in room');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.addToBanList(payload.room, user);
    this.server.emit(payload.room, {
      source: payload.target,
      target: payload.room,
      action: actionTypes.left,
    });
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    this.server.emit(targetStatus.clientId, {
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const room = await this.roomService.findOne(payload.room);
    if (!room) throw new WsException('Room not found');
    if ((await this.roomService.getRole(room, admin.uid)) == userRole.none)
      throw new WsException('Source user is not admin of the room');
    await this.roomService.addAdmin(payload.room, user);
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
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
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);
    if (user == null) throw new WsException('User not found');
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
      throw new WsException('Source user is not admin of the room');
    await this.roomService.addToMutedList(payload.room, user);
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
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
      payload.room == null ||
      payload.source == null ||
      payload.target == null
    )
      throw new WsException('Missing parameter');
    const user = await this.userService.findOne(payload.target);

    if (user == null) throw new WsException('User not found');
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
      throw new WsException('Source user is not admin of the room');
    await this.roomService.removeFromMutedList(payload.room, user);
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
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
      payload.room == null ||
      payload.password == null ||
      payload.source == null
    )
      throw new WsException('Missing parameter');
    console.log('setPasswordToRoom');
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
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
    payload: { roomName: string; username: string; source: string },
  ) {
    if (
      payload.roomName == null ||
      payload.username == null ||
      payload.source == null
    )
      throw new WsException('Missing parameters');
    const user = await this.userService.findOne(payload.username);
    if (!user) throw new WsException('User not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const invitedUserStatus = await this.usersStatusService.getUserStatus(
      payload.username,
    );
    if (!invitedUserStatus) throw new WsException('Invited user not found');
    const room = await this.roomService.findOne(payload.roomName);
    if (!room) throw new WsException('Room not found');
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
    if (payload.roomName == null || payload.username == null)
      throw new WsException('Missing parameters');
    const user = await this.userService.findOne(payload.username);
    if (!user) throw new WsException('User not found');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.username,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    await this.roomService.addUser(payload.roomName, user, true);
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
    if (payload.source == null || payload.target == null)
      throw new WsException('Missing parameters');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException('Source user not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException('Target user not found');
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
      throw new WsException('Target user blocked source user');
    if (
      sourceUser.blockedUsers.some(
        (blockedUser) => blockedUser.blockedUser.uid === targetUser.uid,
      )
    )
      throw new WsException('Source user blocked target user');
    const targetStatus = await this.usersStatusService.getUserStatus(
      payload.target,
    );
    if (!targetStatus) throw new WsException('Target user not found');
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
    console.log('acceptBeingFriend');
    if (payload.source == null || payload.target == null)
      throw new WsException('Missing parameters');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException('Source user not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException('Target user not found');
    const targetStatus = await this.usersStatusService.getUserStatus(
      targetUser.username,
    );
    if (!targetStatus) throw new WsException('Target user not found');
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
      throw new WsException('Target user blocked source user');
    if (
      sourceUser.blockedUsers.some(
        (blockedUser) => blockedUser.blockedUser.uid === targetUser.uid,
      )
    )
      throw new WsException('Source user blocked target user');
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
    if (payload.source == null || payload.target == null)
      throw new WsException('Missing parameters');
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.source,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException('Source user not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException('Target user not found');
    await this.userService.removeFriend(sourceUser, targetUser);
    const targetStatus = await this.usersStatusService.getUserStatus(
      targetUser.username,
    );
    if (!targetStatus) throw new WsException('Target user not found');
    this.server.emit(targetStatus.clientId + 'friend');
    this.server.emit(client.id + 'friend');
  }

  /*
----------------------------GAME---------------------------------
*/

  @SubscribeMessage('matchmaking')
  async handleMatchmaking(client: Socket, payload: { username: string }) {
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
      if (!user1 || !user2) throw new WsException('User not found');
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
      if (!gameRoom) return;
      gameRoom.intervalId = setInterval(() => {
        if (
          gameRoom.player1.score === this.maxScore ||
          gameRoom.player2.score === this.maxScore
        ) {
          console.log('une personne ', payload.username);
          clearInterval(gameRoom.intervalId);
          this.endGame(client, { gameRoomId });
        }
        this.gameService.movePlayer(gameRoomId);
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
    //TODO add achivement, match history
    const gameRoom = this.gameService.getGameRoom(payload.gameRoomId);
    if (!gameRoom) return;
    const userW =
      gameRoom.player1.score === this.maxScore
        ? gameRoom.player1.user
        : gameRoom.player2.user;
    const userL =
      gameRoom.player1.score === this.maxScore
        ? gameRoom.player2.user
        : gameRoom.player1.user;
    await this.gameService.addMatchHistory(payload.gameRoomId, userW, userL);
    await this.gameService.updateRank(userW, userL);
    this.gameService.updateAchivement(userW, userL);
  }

  @SubscribeMessage('leaveGame')
  async leaveGame(
    client: Socket,
    payload: { gameRoomId: string; coward: string },
  ) {
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.coward,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    this.gameService.leaveGame(payload.gameRoomId, payload.coward);
  }

  @SubscribeMessage('cancelMatchmaking')
  async cancelMatchmaking(client: Socket, payload: { username: string }) {
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.username,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    if (this.matchmakingQueue.find((name: string) => name != payload.username))
      throw new WsException('Player not in Matchmaking');
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.player,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    this.gameService.pressUp(payload.player, payload.gameRoomId);
  }

  // @SubscribeMessage('game')
  // async handleGame(
  //   client: Socket,
  //   payload: { player: string; opponent: string; y: number },
  // ) {
  //   const userStatus = await this.usersStatusService.getUserStatus(
  //     payload.player,
  //   );
  //   if (!userStatus || userStatus.clientId !== client.id)
  //     throw new WsException('Forbidden');
  //   this.server.emit(payload.opponent, { mouseY: payload.y });
  // }

  @SubscribeMessage('pressDown')
  async pressDown(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
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
    const userStatus = await this.usersStatusService.getUserStatus(
      payload.player,
    );
    if (!userStatus || userStatus.clientId !== client.id)
      throw new WsException('Forbidden');
    this.gameService.releaseDown(payload.player, payload.gameRoomId);
  }

  /*
-----------------------------------------------------------------
*/

  @SubscribeMessage('changeUsername')
  async changeUsername(client: Socket, payload: string) {
    console.log('changeusername');
    if (payload.length > 10) payload = payload.substring(0, 10);
    const userStatus = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (!userStatus) return;
    console.log(userStatus.username);
    console.log(await this.userService.findOne(payload));
    if (await this.userService.findOne(payload)) {
      this.server.emit(client.id, {
        action: actionTypes.usernameAlreadyTaken,
        newUsername: payload,
      });
      return;
    }
    if (userStatus.clientId !== client.id) throw new WsException('Forbidden');
    const user = await this.userService.findOne(userStatus.username);
    if (!user) return;
    await this.userService.changeUsername(user, payload);
    await this.usersStatusService.changeUsername(userStatus.username, payload);
    this.server.emit(client.id, {
      newUsername: payload,
      action: actionTypes.newUsername,
    });
  }

  @SubscribeMessage('changeBackground')
  async changeBackground(client: Socket, payload: string) {
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
    }
  }

  async afterInit(server: Server) {
    console.log('Init');
    server.on('connection', (client) => {
      client.on('disconnect', (reason) => {
        console.log(`Client disconnected due to: ${reason}`);
      });
    });
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // TODO call function leaveGame if in game
    const userStatusTmp = await this.usersStatusService.getUserStatusByClientId(
      client.id,
    );
    if (!userStatusTmp) return;
    const user = await this.userService.findOne(userStatusTmp.username);
    if (userStatusTmp.status === userStatus.playing) {
      await this.gameService.leaveGame(userStatusTmp.gameRoomId, user.username);
    }
    await this.usersStatusService.setUserStatus(client.id, userStatus.offline);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
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
      currentStatus.status === userStatus.online &&
      client.id !== currentStatus.clientId
    ) {
      client.disconnect();
      return;
    }
    await this.usersStatusService.addUser(
      client.id,
      user.username,
      userStatus.online,
    );
  }
}
