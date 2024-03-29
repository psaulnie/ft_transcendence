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

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { uid: id },
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
      relations: ['friends', 'blockedUsers', 'achievements', 'statistics']
    });
  }

  async findOneAchievements(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: name },
      relations: ['friends', 'blockedUsers', 'achievements', 'statistics']
    });
  }

  async findOneMatchHistory(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      where: [{ user1id: uid }, { user2id: uid }],
    });
  }

  async findOneByIntraUsername(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { intraUsername: name },
    });
  }

  async findOneByUsername(name: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: name },
      relations: ['friends', 'blockedUsers', 'achievements', 'statistics']
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
        'statistics',
      ],
    });
  }

  async blockUser(user: User, blockedUser: User) {
    const block = new BlockedList();
    if (
      user.blockedUsers.find((obj) => obj.blockedUser.uid === blockedUser.uid)
    ) {
      return false;
    }
    user.friends = user.friends.filter((obj) => obj.uid !== blockedUser.uid);
    blockedUser.friends = blockedUser.friends.filter(
      (obj) => obj.uid !== user.uid,
    );
    user.blockedUsers = user.blockedUsers.filter(
      (obj) => obj.blockedUser.uid !== blockedUser.uid,
    );
    block.user = user;
    block.blockedUser = blockedUser;
    user.blockedUsers.push(block);
    await this.blockedUserRepository.save(block);
    await this.usersRepository.save(user);
    return true;
  }

  async unblockUser(user: User, blockedUser: User) {
    user.blockedUsers = user.blockedUsers.filter(
      (obj) =>
        obj.user.uid !== user.uid && obj.blockedUser.uid !== blockedUser.uid,
    );
    await this.usersRepository.save(user);
  }

  async addFriend(user: User, friend: User) {
    if (user.friends.length === 0 && user.achievements.achievement3 === false) {
      user.achievements.achievement3 = true;
      await this.achievementsRepository.save(user.achievements);
    }
    if (
      friend.friends.length === 0 &&
      friend.achievements.achievement3 === false
    ) {
      friend.achievements.achievement3 = true;
      await this.achievementsRepository.save(friend.achievements);
    }
    user.friends.push(friend);
    friend.friends.push(user);
    await this.usersRepository.save(user);
    await this.usersRepository.save(friend);
  }

  async removeFriend(user: User, friend: User) {
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
    user.username = username;
    await this.usersRepository.save(user);
  }

  async changeBackground(username: string, background: string) {
    const user = await this.findOneByUsername(username);
    if (!user) return;
    if (
      user.gameBackground === 'canvas' &&
      user.achievements.achievement5 === false
    ) {
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
