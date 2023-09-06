import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { userStatus } from 'src/users/userStatus';

@Injectable()
export class UsersStatusService {
  private readonly usersStatus: {
    clientId: string;
    username: string;
    status: userStatus;
  }[];
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.usersStatus = [];
  }

  async addUser(
    clientId: string,
    username: string,
    status: userStatus,
  ) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) return;
    const userStatusIndex = this.usersStatus.findIndex(
      (user) => user.username === username,
    );
    if (userStatusIndex != -1)
      this.usersStatus[userStatusIndex] = {
        clientId,
        username,
        status,
      };
    else this.usersStatus.push({ clientId, username, status });
  }

  async removeUser(clientId: string) {
    this.usersStatus.splice(
      this.usersStatus.findIndex((user) => user.clientId === clientId),
      1,
    );
  }

  async changeUsername(old: string, newUsername: string)
  {
    console.log("a");
    const userStatusIndex = this.usersStatus.findIndex(
      (user) => user.username === old,
    );
    if (userStatusIndex != -1)
      this.usersStatus[userStatusIndex].username = newUsername;
  }
  async getUserStatus(username: string) {
    return this.usersStatus.find((user) => user.username === username);
  }

  async getUserStatusByClientId(clientId: string) {
    console.log(clientId);
    console.log(this.usersStatus);
    return this.usersStatus.find((user) => user.clientId === clientId);
  }

  async setUserStatus(clientId: string, status: userStatus) {
    const user = this.usersStatus.find((user) => user.clientId === clientId);
    if (!user) return;
    user.status = status;
  }
}
