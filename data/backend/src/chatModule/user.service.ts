import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { userStatus } from './userStatus';
import { BlockedUsersList } from 'src/entities/blockedUsersList';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(BlockedUsersList)
		private blockedUsersRepository: Repository<BlockedUsersList>
	) {}

	async findOne(name: string): Promise<User>
	{
		return await (this.usersRepository.findOne({where: { username: name }, relations: ['blockedUsersID'] }));
	}

	async findOneById(id: number): Promise<User>
	{
		return await (this.usersRepository.findOne({where: { id: id }}));
	}

	async findOneByClientId(clientId: string): Promise<User>
	{
		return await (this.usersRepository.findOne({where: { clientId: clientId }}));
	}

	async findAll(): Promise<User[]>
	{
		return await (this.usersRepository.find());
	}

	async addUser(user: User): Promise<User>
	{
		return await (this.usersRepository.save(user));
	}

	async createUser(name: string, clientId: string)
	{
		const newUser = new User();

		newUser.clientId = clientId;
		newUser.avatar = "";
		newUser.apiToken = "";
		newUser.intraUsername = name; // TODO edit when authentification is done
		newUser.username = name;
		newUser.isConnected = true;
		newUser.status = userStatus.online;
		
		this.usersRepository.save(newUser);
	}

	async removeUser(name: string)
	{
		return await (this.usersRepository.delete({username: name}));
	}

	async updateClientID(user: User, newID: string)
	{
		user.clientId = newID;
		user.status = userStatus.online;
		this.usersRepository.save(user);
	}

	async blockUser(user: User, blockedUsername: string)
	{
		const newEntry = new BlockedUsersList();
		newEntry.username = blockedUsername;
		newEntry.user = user;
		user.blockedUsersID.push(newEntry);
		await this.usersRepository.save(user);
	}
}