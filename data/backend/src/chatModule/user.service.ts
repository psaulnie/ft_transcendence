import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async findOne(name: string): Promise<User>
	{
		return await (this.usersRepository.findOne({where: { username: name }}));
	}

	async findAll(): Promise<User[]>
	{
		return await (this.usersRepository.find());
	}

	async addUser(user: User): Promise<User>
	{
		return await (this.usersRepository.save(user));
	}

	async removeUser(name: string)
	{
		return await (this.usersRepository.delete({username: name}));
	}
}