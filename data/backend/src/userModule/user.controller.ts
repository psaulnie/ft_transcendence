import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from '../chatModule/user.service';


@Controller('/api/chat/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}


}
