import { Controller, Body, Post, Query, UploadedFile } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpException } from '@nestjs/common'; 

import { diskStorage } from 'multer';
import Path = require('path');
import { randomUUID } from 'crypto';

import { UserService } from './services/user.service';
import { AppService } from './app.service'; 

const storage = {
	storage: diskStorage({
		destination: '/avatars',
		filename: (req, file, cb) => {
			const filename: string = randomUUID();
            const extension: string = Path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
		}
	})
};

@Controller('/api/upload')
export class AppController {
	constructor(private readonly appService: AppService, private readonly userService: UserService) {}

	@Post('/avatar')
    @UseInterceptors(FileInterceptor('file', storage))
	async uploadAvatar(@Body() body: any, @UploadedFile() file: Express.Multer.File) { // TODO add access token
		if (body && file && body.username) {
			const user = await this.userService.findOne(body.username);
			if (user) {
				await this.userService.updateAvatar(user, file.path);
			}
			else
				throw new HttpException('Unprocessable Entity', 422);
		}
		console.log(body.username)
		console.log(file);
	}
}
