import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('/chat/')
export class UserController {
  constructor(private readonly usersService: UserService) {}


}
