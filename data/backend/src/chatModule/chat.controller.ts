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
import { AuthenticatedGuard } from '../auth/guards/intraAuthGuard.service';
import { User } from 'src/entities';
import { userRole } from './chatEnums';
import { UsersStatusService } from 'src/services/users.status.service';
import { userStatus } from 'src/users/userStatus';
import RequestWithUser from 'src/auth/service/requestWithUser.interface';

@Controller('/api/chat/')
export class ChatController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UsersService,
    private readonly usersStatusService: UsersStatusService,
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
  @Get('user/blocked')
  async getBlockedUser(@Req() req: RequestWithUser): Promise<string[]> {
    console.log('getBlockedUser');
    const user = req.user as User;

    // if (username == null) throw new HttpException('Bad request', 400);
    // const user = await this.userService.findOne(username);
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
    @Req() req: RequestWithUser,
    @Param('roomName') roomName: string,
  ): Promise<any[]> {
    const cUser = req.user as User;
    if (!cUser) throw new HttpException('Unprocessable Entity', 422);
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
  @Get('user/rooms/list')
  async getUserRoomsList(@Req() req: RequestWithUser): Promise<any[]> {
    const user = req.user as User;
    if (!user) throw new HttpException('Unprocessable Entity', 422);
    const rooms = await this.roomService.findAll();
    if (!rooms) throw new HttpException('Unprocessable Entity', 422);
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
  async getUsersList(@Req() req: RequestWithUser): Promise<string[]> {
    const cUser = req.user as User;
    if (!cUser) {
      throw new HttpException('Unauthorized', 401);
    }
    const users = await this.userService.findAll();
    const usersList: string[] = [];
    for (const element of users) {
      const cUserStatus = await this.usersStatusService.getUserStatus(
        element.username,
      );
      if (!cUserStatus) continue;
      if (cUserStatus && cUserStatus.status === userStatus.offline) {
        continue;
      }
      if (!element.blockedUsers.find((obj) => obj.blockedUser.uid == cUser.uid))
        usersList.push(element.username);
    }
    return usersList;
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get('user/:roomName/status')
  async getUserStatusInRoom(
    @Param('roomName') roomName: string,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    if (roomName == null) throw new HttpException('Bad request', 400);
    const room = await this.roomService.findOne(roomName);
    if (!room) throw new HttpException('Unprocessable Entity', 422);
    const user = req.user as User;
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
      const cUsersStatus = await this.usersStatusService.getUserStatus(
        element.username,
      );
      if (!cUsersStatus) continue;
      if (cUsersStatus && cUsersStatus.status === userStatus.offline) continue;
      if (
        element.username != username &&
        (await this.roomService.isUserInRoom(roomName, element.uid)) == false
      )
        usersList.push({ label: element.username });
    }
    return usersList;
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthenticatedGuard)
  @Get('user/friends')
  async getUserFriendsList(@Req() req: RequestWithUser): Promise<{}[]> {
    const cUser = req.user as User;
    if (!cUser) throw new HttpException('Unprocessable Entity', 422);
    const user = await this.userService.findOne(cUser.username);
    console.log('getuserfriendlist', user.username)
    const friendList = [];
    for (const element of user.friends) {
      if (element) {
        if (element.username != user.username)
          friendList.push(element.username);
        else if (element.username != user.username)
          friendList.push(element.username);
        console.log('friendlist', friendList);
      }
    }
    console.log(friendList);
    return friendList;
  }
}
