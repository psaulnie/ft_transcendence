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
import { GameServicePU } from 'src/services/gamePU.service';
import { subscribe } from 'diagnostics_channel';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/gateway',
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private matchmakingQueue: string[];
  private matchmakingQueuePU: string[];
  private ticServ: number;
  constructor(
    private roomService: RoomService,
    private userService: UsersService,
    private usersStatusService: UsersStatusService,
    private gameService: GameService,
    private gameServicePU: GameServicePU,
  ) {
    this.matchmakingQueue = [];
    this.matchmakingQueuePU = [];
    this.ticServ = 16;
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
    if (this.roomService.isMuted(payload.room, user))
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
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException('Source user not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException('Target user not found');
    if (sourceUser.friends.some((friend) => friend.uid === targetUser.uid))
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
    if (payload.source == null || payload.target == null)
      throw new WsException('Missing parameters');
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException('Source user not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException('Target user not found');
    if (sourceUser.friends.some((friend) => friend.uid === targetUser.uid))
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
  }

  @SubscribeMessage('removeFriend')
  async removeFriend(
    client: Socket,
    payload: { source: string; target: string },
  ) {
    if (payload.source == null || payload.target == null)
      throw new WsException('Missing parameters');
    const sourceUser = await this.userService.findOne(payload.source);
    if (!sourceUser) throw new WsException('Source user not found');
    const targetUser = await this.userService.findOne(payload.target);
    if (!targetUser) throw new WsException('Target user not found');
    if (!sourceUser.friends.some((friend) => friend.uid === targetUser.uid))
      throw new WsException('Not friends');
    await this.userService.removeFriend(sourceUser, targetUser);
  }

  /*
----------------------------GAME---------------------------------
*/
  @SubscribeMessage('matchmaking')
  async handleMatchmaking(client: Socket, payload: { username: string }) {
    // const user = await this.userService.findOne(payload.username);
    // if (!user)
    // throw new WsException("User not found");
    if (this.matchmakingQueue.find((name: string) => name == payload.username)
    || this.matchmakingQueuePU.find((name: string) => name == payload.username))
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
      this.server.emit('matchmaking' + player1, {
        opponent: player2,
        gameRoomId: gameRoomId,
      });
      this.server.emit('matchmaking' + player2, {
        opponent: player1,
        gameRoomId: gameRoomId,
      });
      this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(player1), 1);
      this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(player2), 1);

      this.usersStatusService.setUserStatus(client.id, userStatus.playing);
      this.usersStatusService.setGameRoomId(client.id, gameRoomId);
      const p2Id = await this.usersStatusService.findClientId(payload.username !== player1 ? player1 : player2);
      this.usersStatusService.setUserStatus(p2Id, userStatus.playing);
      this.usersStatusService.setGameRoomId(p2Id, gameRoomId);

      setInterval(() => {
        this.gameService.movePlayer(gameRoomId);
      }, this.ticServ);

      setInterval(() => this.sendInfoGame(gameRoomId), this.ticServ);
    }
  }

  async sendInfoGame(gameRoomId: string) {
      const gameRoom = this.gameService.getGameRoom(gameRoomId);
      if (!gameRoom) return;
      this.server.emit('game' + gameRoomId, {
        playerY: gameRoom.player1.Y,
        enemyY: gameRoom.player2.Y,
        ballX: gameRoom.ballPos.x,
        ballY: gameRoom.ballPos.y,
        p1Score: gameRoom.player1.score,
        p2Score: gameRoom.player2.score,
        coward: gameRoom.coward,
      });
  }

  @SubscribeMessage('cancelMatchmaking')
  async cancelMatchmaking(client: Socket, payload: { username: string }) {
    // const user = await this.userService.findOne(payload.username);
    // if (!user)
    // throw new WsException("User not found");
    if (this.matchmakingQueue.find((name: string) => name != payload.username))
      throw new WsException('Player not in Matchmaking');
    this.matchmakingQueue.splice(
      this.matchmakingQueue.indexOf(payload.username),
      1,
    );
    this.usersStatusService.setUserStatus(client.id, userStatus.online);
  }

  @SubscribeMessage('leaveGame')
  async leaveGame(
    client: Socket,
    payload: { gameRoomId: string; coward: string },
  ) {
    this.usersStatusService.setUserStatus(client.id, userStatus.online);
    this.gameService.leaveGame(payload.gameRoomId, payload.coward);
    this.usersStatusService.setGameRoomId(client.id, payload.gameRoomId);
  }
  
    @SubscribeMessage('game')
    async handleGame(
      client: Socket,
      payload: { player: string; opponent: string; y: number },
    ) {
      this.server.emit(payload.opponent, { mouseY: payload.y });
    }

  @SubscribeMessage('pressUp')
  async pressUp(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
    this.gameService.pressUp(payload.player, payload.gameRoomId);
  }
  
  @SubscribeMessage('pressDown')
  async pressDown(
    client: Socket,
    payload: { player: string; gameRoomId: string },
    ) {
      this.gameService.pressDown(payload.player, payload.gameRoomId);
  }
  
  @SubscribeMessage('releaseUp')
  async releaseUp(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
    this.gameService.releaseUp(payload.player, payload.gameRoomId);
  }
  
  @SubscribeMessage('releaseDown')
  async releaseDown(
    client: Socket,
    payload: { player: string; gameRoomId: string },
    ) {
      this.gameService.releaseDown(payload.player, payload.gameRoomId);
    }
    
//============================================== POWER UP =======================

@SubscribeMessage('matchmakingPU')
  async handleMatchmakingPU(client: Socket, payload: { username: string }) {
    // const user = await this.userService.findOne(payload.username);
    // if (!user)
    // throw new WsException("User not found");
    if (this.matchmakingQueuePU.find((name: string) => name == payload.username
    || this.matchmakingQueue.find((name: string) => name == payload.username)))
      throw new WsException('Already in Matchmaking');
    this.matchmakingQueuePU.push(payload.username);
    while (this.matchmakingQueuePU.length >= 2) {
      const player1 = this.matchmakingQueuePU[0];
      const player2 = this.matchmakingQueuePU[1];
      const user1 = await this.userService.findOne(player1);
      const user2 = await this.userService.findOne(player2);
      if (!user1 || !user2) throw new WsException('User not found');
      const gameRoomId =
        player1 < player2
          ? this.gameServicePU.newGame(user1, user2)
          : this.gameServicePU.newGame(user2, user1);
      this.server.emit('matchmakingPU' + player1, {
        opponent: player2,
        gameRoomId: gameRoomId,
      });
      this.server.emit('matchmakingPU' + player2, {
        opponent: player1,
        gameRoomId: gameRoomId,
      });
      this.matchmakingQueuePU.splice(this.matchmakingQueue.indexOf(player1), 1);
      this.matchmakingQueuePU.splice(this.matchmakingQueue.indexOf(player2), 1);

      this.usersStatusService.setUserStatus(client.id, userStatus.playing);
      this.usersStatusService.setGameRoomId(client.id, gameRoomId);
      const p2Id = await this.usersStatusService.findClientId(payload.username !== player1 ? player1 : player2);
      this.usersStatusService.setUserStatus(p2Id, userStatus.playing);
      this.usersStatusService.setGameRoomId(p2Id, gameRoomId);
      console.log("fin matchmaking", gameRoomId);
      setInterval(() => {
        this.gameServicePU.movePlayer(gameRoomId);
      }, this.ticServ);

      setInterval(() => this.sendInfoGamePU(gameRoomId), this.ticServ);
    }
  }

  async sendInfoGamePU(gameRoomId: string) {
      const gameRoom = this.gameServicePU.getGameRoom(gameRoomId);
      // console.log(gameRoom);
      if (!gameRoom) return;
      this.server.emit('gamePU' + gameRoomId, {
        playerY: gameRoom.player1.Y,
        enemyY: gameRoom.player2.Y,
        ballX: gameRoom.ballPos.x,
        ballY: gameRoom.ballPos.y,
        p1Score: gameRoom.player1.score,
        p2Score: gameRoom.player2.score,
        coward: gameRoom.coward,
      });
  }

  @SubscribeMessage('cancelMatchmakingPU')
  async cancelMatchmakingPU(client: Socket, payload: { username: string }) {
    // const user = await this.userService.findOne(payload.username);
    // if (!user)
    // throw new WsException("User not found");
    if (this.matchmakingQueue.find((name: string) => name != payload.username))
      throw new WsException('Player not in Matchmaking');
    this.matchmakingQueuePU.splice(
      this.matchmakingQueuePU.indexOf(payload.username),
      1,
    );
    this.usersStatusService.setUserStatus(client.id, userStatus.online);
  }

  @SubscribeMessage('leaveGamePU')
  async leaveGamePU(
    client: Socket,
    payload: { gameRoomId: string; coward: string },
  ) {
    this.usersStatusService.setUserStatus(client.id, userStatus.online);
    this.gameServicePU.leaveGame(payload.gameRoomId, payload.coward);
    this.usersStatusService.setGameRoomId(client.id, payload.gameRoomId);
  }
  
    @SubscribeMessage('gamePU')
    async handleGamePU(
      client: Socket,
      payload: { player: string; opponent: string; y: number },
    ) {
      this.server.emit(payload.opponent, { mouseY: payload.y });
    }

  @SubscribeMessage('pressUpPU')
  async pressUpPU(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
    console.log("PRESS UP", payload.gameRoomId);
    this.gameServicePU.pressUp(payload.player, payload.gameRoomId);
  }
  
  @SubscribeMessage('pressDownPU')
  async pressDownPU(
    client: Socket,
    payload: { player: string; gameRoomId: string },
    ) {
      this.gameServicePU.pressDown(payload.player, payload.gameRoomId);
  }
  
  @SubscribeMessage('releaseUpPU')
  async releaseUpPU(
    client: Socket,
    payload: { player: string; gameRoomId: string },
  ) {
    this.gameServicePU.releaseUp(payload.player, payload.gameRoomId);
  }
  
  @SubscribeMessage('releaseDownPU')
  async releaseDownPU(
    client: Socket,
    payload: { player: string; gameRoomId: string },
    ) {
      this.gameServicePU.releaseDown(payload.player, payload.gameRoomId);
    }
  
    /*
    -----------------------------------------------------------------
    */
    @SubscribeMessage('changeUsername')
    async changeUsername(client: Socket, payload: string) {
      console.log('changeusername');
      const userStatus = await this.usersStatusService.getUserStatusByClientId(
        client.id,
      );
      if (!userStatus) return;
      // console.log(userStatus.username);
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

  async afterInit(server: Server) {
    console.log('Init');
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const user = await this.usersStatusService.getUserStatusByClientId(client.id);
    if (!user) return ;
    console.log(user.status, userStatus.playing);
    if (user.status === userStatus.playing) {
      console.log("in hell");
      this.leaveGame(client, {gameRoomId: await this.usersStatusService.getGameRoomId(client.id) , coward: user.username});
    }
    await this.usersStatusService.setUserStatus(client.id, userStatus.offline);
    // TODO call function leaveGame if in game
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    console.log(client.handshake.headers);
    if (client.handshake.headers.cookie.split('=')[1] === 'test') {
      // TODO remove when testUser removed
      await this.usersStatusService.addUser(
        client.id,
        'testUser',
        userStatus.online,
      );
      return;
    }
    const credential = client.handshake.headers.cookie
      ?.split(';')
      .find((cookie) => cookie.includes('connect.sid'));
    if (!credential) return;
    const connectSid = credential.substring(
      credential.indexOf('s%3A') + 4,
      credential.indexOf('.', credential.indexOf('s%3A')),
    );
    const session = await this.userService.findOneSession(connectSid);
    if (!session) return;
    const parsedJson = JSON.parse(session.json);
    const user = await this.userService.findOneByIntraUsername(
      parsedJson.passport.user.intraUsername,
    );
    if (!user) return;
    await this.usersStatusService.addUser(
      client.id,
      user.username,
      userStatus.online,
    );
  }
}
