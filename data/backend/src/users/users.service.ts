import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { BlockedList } from 'src/entities/blocked.list.entity';
import { FriendList } from 'src/entities/friend.list.entity';
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
    @InjectRepository(FriendList)
    private friendListRepository: Repository<FriendList>,
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
      relations: [
        'achievements',
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
        'friends',
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

  async createUser(name: string) {
    console.log('createuser');
    if (await this.findOneByUsername(name)) {
      return;
    }
    const newUser = new User();
    const statistics = new Statistics();
    const achievements = new Achievements();

    newUser.urlAvatar = '';
    newUser.username = name;
    newUser.accessToken = 'test';
    newUser.refreshToken = '';
    newUser.blockedUsers = [];
    newUser.intraId = '';
    newUser.intraUsername = name;
    newUser.friends = [];
    newUser.matchHistory = [];
    newUser.statistics = statistics;
    newUser.achievements = achievements;

    console.log('before');
    await this.statisticsRepository.save(statistics);
    await this.achievementsRepository.save(achievements);
    await this.usersRepository.save(newUser);
    console.log('finish');

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

  async addFriend(user: User, friend: User) {
    console.log('addfriend');
    const newFriend = new FriendList();
    newFriend.user1 = user;
    newFriend.user2 = friend;
    user.friends.push(friend);
    friend.friends.push(user);
    await this.usersRepository.save(user);
    await this.usersRepository.save(friend);
  }

  async removeFriend(user: User, friend: User) {
    console.log('removefriend');
    user.friends = user.friends.filter(
      (obj) => (obj.username !== friend.username));
    friend.friends = friend.friends.filter(
      (obj) => (obj.username !== user.username));
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
    console.log('changeusername');
    user.username = username;
    await this.usersRepository.save(user);
  }

  async findOneSession(sessionId: string): Promise<TypeormSession> {
    return await this.typeormSessionRepository.findOne({
      where: { id: sessionId },
    });
  }
}
