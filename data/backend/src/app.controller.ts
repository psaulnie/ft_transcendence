import { Controller, Body, Post, Query, UploadedFile } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpException } from '@nestjs/common'; 
import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';

import { diskStorage } from 'multer';
import Path = require('path');
import { randomUUID } from 'crypto';

import { UserService } from './services/user.service';
import { AppService } from './app.service'; 


const fileInterceptorOptions = {
	fileFilter: (req, file, cb) => {
		const validator = new FileTypeValidator({fileType: /\.(jpg|jpeg|png|gif)$/});

		console.log(validator.isValid(file));
		if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif')
			cb(null, true);
		else {
			cb(null, false);
		}
	},
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
    @UseInterceptors(
		FileInterceptor('file', fileInterceptorOptions))
	async uploadAvatar(@Body() body: any, @UploadedFile() file: Express.Multer.File) { // TODO add access token
		if (body && file && body.username) {
			const user = await this.userService.findOne(body.username);
			if (user) {
				console.log("upload");
				await this.userService.updateAvatar(user, file.path);
			}
			else
				throw new HttpException('Unprocessable Entity', 422);
		}
		else
			throw new HttpException('Unprocessable Entity', 422);
	}
}
