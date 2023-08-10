import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { userStatus } from '../users/userStatus';
import path from 'path';
import fs from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // For testing only, TO REMOVE-----------------------------------------------------------
  private index = 0;
  private users = [];

  // async findOne(
  //   username: string,
  // ): Promise<{ id: number; username: string; password: string } | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }
  // //----------------------------------------------------------------------------------------

  async findOne(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: name },
      relations: ['blockedUsers'],
    });
  }

  async findOneByUsername(name: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { username: name } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async findOneByClientId(clientId: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { clientId: clientId },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async addUser(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async createUser(name: string, pass: string) {
    console.log('createuser');
    const newUser = new User();

    newUser.urlAvatar = '';
    newUser.username = name;
    if (!newUser.blockedUsers) newUser.blockedUsers = [];

    await this.usersRepository.save(newUser);

    // For testing ----
    // const newUser = {
    //   id: this.index--,
    //   username: name,
    //   password: pass,
    //   avatar:
    //     'https://marketplace.canva.com/MAB6vzmEQlA/1/thumbnail_large/canva-robot-electric-avatar-icon-MAB6vzmEQlA.png',
    // };
    // this.users.push(newUser);
    // // End of testing ----
    // console.log('users in createUser ', this.users);
    // console.log(`${newUser.username} successfully registered`);
    // return newUser;
  }

  async removeUser(name: string) {
    return await this.usersRepository.delete({ username: name });
  }

  async blockUser(user: User, blockedUser: User) {
    console.log('blockuser');
    user.blockedUsers.push(blockedUser);
    await this.usersRepository.save(user);
  }

  async unblockUser(user: User, blockedUser: User) {
    console.log('unblockuser');
    user.blockedUsers = user.blockedUsers.filter(
      (obj) => obj.username !== blockedUser.username,
    );
    await this.usersRepository.save(user);
  }

  async updateAvatar(user: User, avatar: string) {
    console.log('updateavatar');
    if (user.urlAvatar !== '') {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(__dirname, '/avatars', user.urlAvatar);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(err);
      }
    }
    user.urlAvatar = avatar;
    await this.usersRepository.save(user);
  }
}
