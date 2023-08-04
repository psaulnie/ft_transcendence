import { Controller, Body, Post, UploadedFile, Get, StreamableFile, Res, Param } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpException } from '@nestjs/common';

import { createReadStream } from 'fs';
import { join } from 'path';

import { diskStorage } from 'multer';
import Path = require('path');
import { randomUUID } from 'crypto';

import { UserService } from './services/user.service';
import { AppService } from './app.service'; 
import { Response } from 'express';

const fileInterceptorOptions = {
	fileFilter: (req, file, cb) => {
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
	}),
	limits: {
		fieldNameSize: 255,
		fileSize: 1024 * 1024 * 5
	}
};

@Controller('/api/avatar')
export class AppController {
	constructor(private readonly appService: AppService, private readonly userService: UserService) {}

	@Post('/upload')
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
			throw new HttpException('Bad Request', 400);
	}

	@Get(':username')
	async getAvatar(@Param('username') username: string, @Res({ passthrough: true }) res: Response) : Promise<StreamableFile> { // TODO Need to handle URLs
		if (username == null) {
			throw new HttpException('Bad Request', 400);
		}
		
		const user = await this.userService.findOne(username);
		if (user) {
			const path = user.urlAvatar;
			if (path == '')
			{
				const file = createReadStream(join(process.cwd(), '../avatars/default.jpg'));
				if (file)
				{
					res.set({
						'Content-Type': 'image/jpg'
					});
					return new StreamableFile(file);
				}
				else
					throw new HttpException('Internal Server Error', 500);
			}
			else if (path)
			{
				const file = createReadStream(join(process.cwd(), '..' + path));
				if (file)
				{
					const mime = require('mime');
					const mime_type = mime.getType(path);
					if (!mime_type)
						throw new HttpException('Internal Server Error', 500);
					res.set({
						'Content-Type': mime_type
					});
					return new StreamableFile(file);
				}
				else
					throw new HttpException('Internal Server Error', 500);
			}
		}
		const file = createReadStream(join(process.cwd(), '../avatars/default.jpg'));
		if (file)
		{
			res.set({
				'Content-Type': 'image/jpg'
			});
			return new StreamableFile(file);
		}
		else
			throw new HttpException('Internal Server Error', 500);
	}
}
