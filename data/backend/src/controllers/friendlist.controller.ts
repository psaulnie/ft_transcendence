import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthenticatedGuard } from '../auth/guards/intraAuthGuard.service';
import RequestWithUser from '../auth/service/requestWithUser.interface';

@Controller('/friends')
export class FriendListController {
  constructor(private readonly userService: UsersService) {}

  @Get('/list')
  @UseGuards(AuthenticatedGuard)
  async getFriendsList(@Req() request: RequestWithUser) {
    const user = await this.userService.findOne(request.user.username);
    const friendList = [];
    console.log('user', user);
    for (const element of user.friends) {
      if (element) {
        if (element.username != user.username) {
          friendList.push(element.username);
        }
        console.log('friendlist', friendList);
      }
    }
    console.log(friendList);
    return friendList;
  }

  @Get('/status')
  @UseGuards(AuthenticatedGuard)
  async getFriendsStatus() {
    return;
  }
}
