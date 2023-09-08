import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthenticatedGuard } from '../auth/guards/intraAuthGuard.service';
import RequestWithUser from '../auth/service/requestWithUser.interface';
import { UsersStatusService } from '../services/users.status.service';

@Controller('/friends')
export class FriendListController {
  constructor(
    private readonly userService: UsersService,
    private readonly usersStatusService: UsersStatusService,
  ) {}

  @Get('/list')
  @UseGuards(AuthenticatedGuard)
  async getFriendsList(@Req() request: RequestWithUser) {
    const user = await this.userService.findOne(request.user.username);
    const friendList = [];
    for (const element of user.friends) {
      if (element) {
        if (element.username != user.username) {
          const status = await this.usersStatusService.getUserStatus(
            element.username,
          );
          friendList.push({ username: status.username, status: status.status });
        }
      }
    }
    return friendList;
  }
}
