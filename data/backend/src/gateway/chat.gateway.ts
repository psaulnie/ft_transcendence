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
import { UsersService } from 'src/users/users.service';

import {
  manageRoomsArgs,
  banArgs,
  kickArgs,
  sendMsgArgs,
} from './args.interface';
import { manageRoomsTypes, sendMsgTypes } from './args.types';
import { accessStatus } from 'src/chatModule/accessStatus';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/gateways/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private roomService: RoomService,
    private userService: UsersService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('newUser')
  async createUser(client: Socket, payload: string) {
    const user = await this.userService.findOneByUsername(payload); //Change findOne !
    if (user == null) {
      console.log('New user: ' + payload);
      await this.userService.createUser(payload, client.id);
    } else {
      user.clientId = client.id;
      // user.status = userStatus.online; // TODO to remove if not needed
    }
  }

  @SubscribeMessage('sendMsg')
  async handleMessage(client: Socket, payload: sendMsgArgs) {
    if (payload.type == sendMsgTypes.msg) {
      this.server.emit(payload.target, payload.source + ': ' + payload.data);
    }
  }

  @SubscribeMessage('manageRooms')
  async handleRoom(client: Socket, payload: manageRoomsArgs) {
    const user = await this.userService.findOne(payload.source);
    if (payload.type == manageRoomsTypes.add) {
      if ((await this.roomService.findOne(payload.room)) == null) {
        await this.roomService.createRoom(
          payload.room,
          user.id,
          payload.access,
        );
      } else {
        const nbr = await this.roomService.addUser(payload.room, user.id);
        if (nbr == -1) {
          this.server.emit(payload.source, 'BAN ' + payload.room);
          return;
        }
        if (nbr == accessStatus.private) {
          this.server.emit(payload.source, 'PRIVATE ' + payload.room);
          return;
        }
      }
      this.server.emit(payload.room, payload.source + ' JOIN');
    } else if (payload.type == manageRoomsTypes.remove) {
      await this.roomService.removeUser(payload.room, user.id);
      this.server.emit(payload.room, payload.source + ' LEFT');
    }
  }

  @SubscribeMessage('kick')
  async kickUser(client: Socket, payload: kickArgs) {
    const user = await this.userService.findOne(payload.target);
    await this.roomService.removeUser(payload.room, user.id);
    this.server.emit(payload.target, 'KICK ' + payload.room);
  }

  @SubscribeMessage('ban')
  async banUser(client: Socket, payload: banArgs) {
    const user = await this.userService.findOne(payload.target);
    await this.roomService.addToBanList(payload.room, user.id);
    await this.roomService.removeUser(payload.room, user.id);
    this.server.emit(payload.target, 'BAN ' + payload.room);
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
