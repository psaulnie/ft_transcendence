import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { userStatus } from 'src/users/userStatus';
import { Socket } from 'socket.io';
@Injectable()
export class UsersStatusService {
  private readonly usersStatus: {
    clientId: string[];
    client: Socket;
    username: string;
    status: userStatus;
    gameRoomId: string;
  }[];
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.usersStatus = [];
  }

  async addUser(clientId: string, client: Socket, username: string, status: userStatus) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) return;
    const userStatusIndex = this.usersStatus.findIndex(
      (user) => user.username === username,
    );
    if (userStatusIndex != -1) {
      this.usersStatus[userStatusIndex].clientId.push(clientId);
      this.usersStatus[userStatusIndex].client = client;
      this.usersStatus[userStatusIndex].status = status;
    }
    else this.usersStatus.push({ clientId: [clientId], client, username, status, gameRoomId:'' });
  }

  async changeUsername(old: string, newUsername: string) {
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
    return this.usersStatus.find((user) => user.clientId.find((id) => id === clientId));
  }

  async setUserStatus(clientId: string, status: userStatus) {
    const user = this.usersStatus.find((user) => user.clientId.find((id) => id === clientId));
    if (!user) return;
    user.status = status;
  }
}
