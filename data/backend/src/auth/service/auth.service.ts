import { Injectable } from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { UserDetails } from '../../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService implements AuthProvider {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async validateUser(details: UserDetails) {
    const { clientId } = details;
    const user = await this.userRepo.findOneBy({ clientId });
    console.log('Found user in db', user);
    console.log('-----');
    if (user) return user;
    return this.createUser(details);
  }

  async createUser(details: UserDetails) {
    console.log('Creating User');
    console.log(details);
    console.log('-----');
    const user = await this.userRepo.create(details);
    return this.userRepo.save(user);
  }

  findUser(clientId: string): Promise<User> | undefined {
    return this.userRepo.findOneBy({ clientId });
  }
}
