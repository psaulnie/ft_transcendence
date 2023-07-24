import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { userStatus } from './userStatus';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // For testing only, TO REMOVE-----------------------------------------------------------
  private index = 0;
  private users = [];

  async findOne(
    username: string,
  ): Promise<{ id: number; username: string; password: string } | undefined> {
    return this.users.find((user) => user.username === username);
  }
  //----------------------------------------------------------------------------------------

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
    // const newUser = new User();

    // newUser.clientId = ""; //TODO delete
    // newUser.apiToken = ""; //TODO delete
    // newUser.id = this.index--;
    // newUser.username = name;
    // newUser.password = pass;
    // newUser.avatar = ''; //Set an image by default

    // this.usersRepository.save(newUser);

    // For testing ----
    const newUser = {
      id: this.index--,
      username: name,
      password: pass,
      avatar:
        'https://marketplace.canva.com/MAB6vzmEQlA/1/thumbnail_large/canva-robot-electric-avatar-icon-MAB6vzmEQlA.png',
    };
    this.users.push(newUser);
    // End of testing ----
    console.log('users in createUser ', this.users);
    console.log(`${newUser.username} successfully registered`);
    return newUser;
  }

  async removeUser(name: string) {
    return await this.usersRepository.delete({ username: name });
  }
}
