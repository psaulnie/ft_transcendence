import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { TypeormSession } from 'src/entities';
import { MatchHistory } from 'src/entities/matchHistory.entity';
import { Statistics } from 'src/entities/stats.entity';
import { Achievements } from 'src/entities/achievements.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(BlockedList)
    private blockedUserRepository: Repository<BlockedList>,
    @InjectRepository(TypeormSession)
    private typeormSessionRepository: Repository<TypeormSession>,
    @InjectRepository(MatchHistory)
    private matchHistoryRepository: Repository<MatchHistory>,
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
    @InjectRepository(Achievements)
    private achievementsRepository: Repository<Achievements>,
  ) {}

  async findOne(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: name },
      relations: [
        'blockedUsers',
        'friends',
        'achievements',
        'blockedUsers.blockedUser',
        'blockedUsers.user',
        'statistics',
      ],
    });
  }

  async findOneProfile(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: name },
      relations: [
        'friends',
        'matchHistory',
        'matchHistory.user1',
        'matchHistory.user2',
        'statistics',
      ],
    });
  }

  async findOneAchievements(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: name },
      relations: ['achievements'],
    });
  }

  async findOneByIntraUsername(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { intraUsername: name },
    });
  }

  async findOneByUsername(name: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { username: name }, relations: ['achievements'] });
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { uid: id },
      relations: [
        'friends',
        'matchHistory',
        'matchHistory.user1',
        'matchHistory.user2',
        'statistics',
      ],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: [
        'blockedUsers',
        'friends',
        'achievements',
        'blockedUsers.blockedUser',
        'blockedUsers.user',
      ],
    });
  }

  async addUser(user: User): Promise<User> {
    return await this.usersRepository.save(user);
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
    user.friends = user.friends.filter((obj) => obj.uid !== blockedUser.uid);
    user.blockedUsers = user.blockedUsers.filter(
      (obj) => obj.blockedUser.uid !== blockedUser.uid,
    ); // TODO test, remove the blockedUser from the friendList
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

  async addFriend(user: User, friend: User) {
    console.log('addfriend');
    user.friends.push(friend);
    friend.friends.push(user);
    console.log(await this.usersRepository.save(user));
    await this.usersRepository.save(friend);
    
  }

  async removeFriend(user: User, friend: User) {
    console.log('removefriend');
    user.friends = user.friends.filter(
      (obj) => obj.username !== friend.username,
    );
    friend.friends = friend.friends.filter(
      (obj) => obj.username !== user.username,
    );
    await this.usersRepository.save(user);
    await this.usersRepository.save(friend);
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

  async changeUsername(user: User, username: string) {
    console.log('changeusername in service');
    user.username = username;
    await this.usersRepository.save(user);
  }
  
  async changeBackground(username: string, background: string)
  {
    const user = await this.findOneByUsername(username);
    if (!user) return ;
    if (user.gameBackground === 'canvas') {
      user.achievements.achievement5 = true;
      await this.achievementsRepository.save(user.achievements);
    }
    user.gameBackground = background;
    await this.usersRepository.save(user);
  }

  async findOneSession(sessionId: string): Promise<TypeormSession> {
    return await this.typeormSessionRepository.findOne({
      where: { id: sessionId },
    });
  }

  async isTwoFactorAuthenticated(userId: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { uid: userId },
      select: ['isTwoFactorAuthenticated'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.isTwoFactorAuthenticated;
  }

  async setIsTwoFactorAuthenticated(userId: number, value: boolean) {
    return await this.usersRepository.update(userId, {
      isTwoFactorAuthenticated: value,
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
