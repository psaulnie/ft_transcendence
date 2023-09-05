import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { TypeormSession } from 'src/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(BlockedList)
    private blockedUserRepository: Repository<BlockedList>,
    @InjectRepository(TypeormSession)
    private typeormSessionRepository: Repository<TypeormSession>,
  ) {}

  async findOne(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: name },
      relations: [
        'blockedUsers',
        'friendList',
        'achievements',
        'blockedUsers.blockedUser',
        'blockedUsers.user',
      ],
    });
  }

  async findOneByUsername(name: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { username: name } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { uid: id } });
  }

  async findOneByAccessToken(accessToken: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { accessToken: accessToken },
      relations: [
        'blockedUsers',
        'friendList',
        'achievements',
        'blockedUsers.blockedUser',
        'blockedUsers.user',
      ],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: [
        'blockedUsers',
        'friendList',
        'achievements',
        'blockedUsers.blockedUser',
        'blockedUsers.user',
      ],
    });
  }

  async addUser(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async createUser(name: string) {
    console.log('createuser');
    if (await this.findOneByUsername(name)) {
      return;
    }
    const newUser = new User();
    newUser.urlAvatar = '';
    newUser.username = name;
    newUser.accessToken = 'test';
    newUser.refreshToken = '';
    newUser.blockedUsers = [];
    newUser.intraId = '';
    newUser.intraUsername = '';
    newUser.friendList = [];
    newUser.matchHistory = null;
    newUser.statistics = null;
    newUser.achievements = null;

    await this.usersRepository.save(newUser);
  }

  async removeUser(name: string) {
    return await this.usersRepository.delete({ username: name });
  }
  // TODO FRIEND LIST (ADD, REMOVE, GET WITH CONDITIONS!!! LIKE UID1 < UID2)
  async blockUser(user: User, blockedUser: User) {
    console.log('blockuser');
    const block = new BlockedList();
    if (
      user.blockedUsers.find((obj) => obj.blockedUser.uid === blockedUser.uid)
    ) {
      return;
    }
    block.user = user;
    block.blockedUser = blockedUser;
    user.blockedUsers.push(block);
    await this.blockedUserRepository.save(block);
    await this.usersRepository.save(user);
  }

  async unblockUser(user: User, blockedUser: User) {
    console.log('unblockuser');
    user.blockedUsers = user.blockedUsers.filter(
      (obj) =>
        obj.user.uid !== user.uid && obj.blockedUser.uid !== blockedUser.uid,
    );
    await this.usersRepository.save(user);
  }

  async updateAvatar(user: User, avatar: string, isUrl: boolean) {
    console.log('updateavatar');
    if (isUrl == false && user.urlAvatar !== '' && user.urlAvatar !== null) {
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

  async findOneSession(sessionId: string): Promise<TypeormSession> {
    return await this.typeormSessionRepository.findOne({
      where: { id: sessionId },
    });
  }

  async setTwoFactorAuthSecret(secret: string, userId: number) {
    return await this.usersRepository.update(userId, {
      twoFactorAuthSecret: secret,
    });
  }

  async turnOnTwoFactorAuth(userId: number) {
    return await this.usersRepository.update(userId, {
      isTwoFactorAuthEnabled: true,
    });
  }

  async turnOffTwoFactorAuth(userId: number) {
    return await this.usersRepository.update(userId, {
      isTwoFactorAuthEnabled: false,
    });
  }

  async isTwoFactorAuthEnabled(userId: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { uid: userId },
      select: ['isTwoFactorAuthEnabled'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.isTwoFactorAuthEnabled;
  }

  async changeTwoFactorAuthState(userId: number, twoFactorAuthState: boolean) {
    await this.usersRepository.update(userId, {
      twoFactorAuthState: twoFactorAuthState,
    });
    return twoFactorAuthState;
  }

  async getTwoFactorAuthState(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { uid: userId },
      select: ['twoFactorAuthState'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.twoFactorAuthState;
  }
}
