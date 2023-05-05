import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getUsers(name: string): string {
    if (name == 'pierrotswag')
      return 'pierrotswag';
    else
      return 'looser!!!';
  }
}
