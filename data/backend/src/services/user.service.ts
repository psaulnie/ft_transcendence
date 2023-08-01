import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { userStatus } from '../chatModule/userStatus';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async findOne(name: string): Promise<User>
	{
		return await (this.usersRepository.findOne({where: { username: name }, relations: ['blockedUsers'] }));
	}

	async findOneById(id: number): Promise<User>
	{
		return await (this.usersRepository.findOne({where: { id: id }}));
	}

	async findAll(): Promise<User[]>
	{
		return await (this.usersRepository.find());
	}

	async addUser(user: User): Promise<User>
	{
		console.log("adduser");
		return await (this.usersRepository.save(user));
	}

	async createUser(name: string, clientId: string)
	{
		console.log("createuser");
		const newUser = new User();

		newUser.urlAvatar = "";
		newUser.intraUsername = name; // TODO edit when authentification is done
		newUser.username = name;
		newUser.isConnected = true;
		newUser.status = userStatus.online;
		if (!newUser.blockedUsers)
			newUser.blockedUsers = [];
		
		this.usersRepository.save(newUser);
	}

	async removeUser(name: string)
	{
		console.log("removeuser");
		return await (this.usersRepository.delete({username: name}));
	}

	async blockUser(user: User, blockedUser: User)
	{
		console.log("blockuser");
		user.blockedUsers.push(blockedUser);
		await this.usersRepository.save(user);
	}

	async unblockUser(user: User, blockedUser: User)
	{
		console.log("unblockuser");
		user.blockedUsers = user.blockedUsers.filter((obj) => obj.username !== blockedUser.username);
		await this.usersRepository.save(user);
	}

	async updateAvatar(user: User, avatar: string)
	{
		console.log("updateavatar");
		if (user.urlAvatar !== "")
		{
			const fs = require('fs');
			const path = require('path');
			const filePath = path.resolve(__dirname, '/avatars', user.urlAvatar);
			try {
				fs.unlinkSync(filePath);
			}
			catch (err) {
				console.error(err);
			}
		}
		user.urlAvatar = avatar;
		await this.usersRepository.save(user);
	}
}