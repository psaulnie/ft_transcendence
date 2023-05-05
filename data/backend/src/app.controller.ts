import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUsers(@Query() query: { name: string}): string {
    return this.appService.getUsers(query.name);
  }
}
