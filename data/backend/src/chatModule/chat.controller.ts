import {
  Controller,
  Query,
  Get,
  HttpException,
  Param,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RoomService } from '../services/room.service';
import { UsersService } from '../users/users.service';
import { IsAuthGuard } from 'src/auth/guards/intra-auth.guards';
import { AuthenticatedGuard } from 'src/auth/guards/intra-auth.guards';
import { User } from 'src/entities';
import { userRole } from './chatEnums';

@Controller('/api/chat/')
export class ChatController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UsersService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get('role/:username/:roomName')
  async getRole(
    @Param('username') username: string,
    @Param('roomName') roomName: string,
  ): Promise<userRole> {
    if (username == null || roomName == null)
      throw new HttpException('Bad request', 400);
    const user = await this.userService.findOne(username);
    if (!user) throw new HttpException('Unprocessable Entity', 422);
    const room = await this.roomService.findOne(roomName);
    if (!room) throw new HttpException('Unprocessable Entity', 422);
    return await this.roomService.getRole(room, user.uid);
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get(':username/blocked')
  async getBlockedUser(@Param('username') username: string): Promise<string[]> {
    console.log('getBlockedUser');
    if (username == null) throw new HttpException('Bad request', 400);
    const user = await this.userService.findOne(username);
    if (!user) throw new HttpException('Unprocessable Entity', 422);
    const usersList = [];
    const blockedUsers = user.blockedUsers;
    let userBlocked: User;
    for (const element of blockedUsers) {
      if (element) {
        userBlocked = await this.userService.findOneById(
          element.blockedUser.uid,
        );
        if (!userBlocked) return;
        usersList.push(userBlocked.username);
      }
    }
    return usersList;
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get('rooms/list')
  async getRoomsList(): Promise<{}[]> {
    const rooms = await this.roomService.findAll();
    const roomsList: {}[] = [];

    rooms.forEach((element) =>
      roomsList.push({
        roomName: element.roomName,
        hasPassword: element.password !== '',
        access: element.access,
      }),
    );
    return roomsList;
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get(':roomName/users')
  async getUsersInRoom(
    @Query() data: any,
    @Param('roomName') roomName: string,
  ): Promise<any[]> {
    if (roomName == null) throw new HttpException('Bad request', 400);
    const room = await this.roomService.findOne(roomName);
    if (!room) throw new HttpException('Unprocessable Entity', 422);
    const usersList = [];
    let user: User;
    for (const element of room.usersList) {
      if (!element.user.uid || element.isBanned === true) continue;
      user = await this.userService.findOneById(element.user.uid);
      if (!user) continue;
      usersList.push({
        username: user.username,
        role: element.role,
        isMuted: element.isMuted,
      });
    }
    return usersList;
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get(':username/rooms/list')
  async getUserRoomsList(
    @Query() data: any,
    @Param('username') username: string,
  ): Promise<any[]> {
    if (username == null) throw new HttpException('Bad request', 400);
    const rooms = await this.roomService.findAll();
    if (!rooms) throw new HttpException('Unprocessable Entity', 422);
    const user = await this.userService.findOne(username);
    if (!user) throw new HttpException('Unprocessable Entity', 422);
    const roomsList = [];
    for (const element of rooms) {
      const userInfo = element.usersList.find(
        (obj) => user.uid == obj.user.uid,
      );
      if (element.usersList.find((obj) => user.uid == obj.user.uid))
        roomsList.push({
          roomName: element.roomName,
          role: userInfo.role,
          isMuted: userInfo.isMuted,
          isBanned: userInfo.isBanned,
          hasPassword: element.password !== '',
        });
    }
    return roomsList;
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get(':roomName/exist')
  async getIsRoomNameTaken(
    @Query() data: any,
    @Param('roomName') roomName: string,
  ): Promise<boolean> {
    if (roomName == null) throw new HttpException('Bad request', 400);
    const room = await this.roomService.findOne(roomName);
    return room != null;
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get('users/list')
  async getUsersList(@Req() req: Request): Promise<string[]> {
    let [type, token] = req.headers['authorization']?.split(' ') ?? [];
    if (type !== 'Bearer') {
      token = undefined;
    }
    if (!token) {
      throw new HttpException('Unauthorized', 401);
    }
    const cUser = await this.userService.findOneByAccessToken(token);
      // const cUser = await this.userService.findOne('testUser');
    if (!cUser) {
      throw new HttpException('Unauthorized', 401);
    }
    const users = await this.userService.findAll();
    const usersList: string[] = [];
    console.log('cUser:',cUser);
    users.forEach((element) => {
      console.log(element);
      if (!element.blockedUsers.find((obj) => obj.blockedUser.uid == cUser.uid))
        usersList.push(element.username);
    });
    return usersList;
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get(':username/:roomName/status')
  async getUserStatusInRoom(
    @Param('username') username: string,
    @Param('roomName') roomName: string,
  ): Promise<any> {
    if (username == null || roomName == null)
      throw new HttpException('Bad request', 400);
    const room = await this.roomService.findOne(roomName);
    if (!room) throw new HttpException('Unprocessable Entity', 422);
    const user = await this.userService.findOne(username);
    if (!user) throw new HttpException('Unprocessable Entity', 422);
    const userInRoom = room.usersList.find((obj) => obj.user.uid == user.uid);
    if (!userInRoom) throw new HttpException('Unprocessable Entity', 422);
    return { isMuted: userInRoom.isMuted, role: userInRoom.role };
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get(':username/:roomName/invited')
  async getInvitedUsersList(
    @Param('username') username: string,
    @Param('roomName') roomName: string,
  ): Promise<{}[]> {
    if (username == null || roomName == null)
      throw new HttpException('Bad request', 400);
    const users = await this.userService.findAll();
    const usersList: {}[] = [];

    for (const element of users) {
      if (
        element.username != username &&
        (await this.roomService.isUserInRoom(roomName, element.uid)) == false
      )
        usersList.push({ label: element.username });
    }
    return usersList;
  }
}
