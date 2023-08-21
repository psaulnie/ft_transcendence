import {
  Controller,
  Body,
  Post,
  UploadedFile,
  Get,
  StreamableFile,
  Res,
  Param,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpException } from '@nestjs/common';

import { createReadStream } from 'fs';
import { join } from 'path';

import { diskStorage } from 'multer';
import Path = require('path');
import { randomUUID } from 'crypto';

import { UsersService } from './users/users.service';
import { Response } from 'express';
import { AppService } from './services/app.service';

import { IsAuthGuard } from './auth/guards/intra-auth.guards';
import { UseGuards } from '@nestjs/common';

const fileInterceptorOptions = {
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/gif'
    )
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
      cb(null, `${filename}${extension}`);
    },
  }),
  limits: {
    fieldNameSize: 255,
    fileSize: 1024 * 1024 * 5,
  },
};

@Controller('/api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
  ) {}

  @Post('/avatar/upload')
  @UseGuards(IsAuthGuard)
  @UseInterceptors(FileInterceptor('file', fileInterceptorOptions))
  async uploadAvatar(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (body && file && body.username) {
      const user = await this.userService.findOne(body.username);
      if (user) {
        console.log('upload');
        await this.userService.updateAvatar(user, file.path);
      } else throw new HttpException('Unprocessable Entity', 422);
    } else throw new HttpException('Bad Request', 400);
  }

  @Get('/avatar/:username')
  async getAvatar(
    @Param('username') username: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (username == null) {
      throw new HttpException('Bad Request', 400);
    }

    const user = await this.userService.findOne(username);
    if (user) {
      const path = user.urlAvatar;
      if (path) {
        const file = createReadStream(join(process.cwd(), '..' + path));
        if (file) {
          const mime = require('mime');
          const mime_type = mime.getType(path);
          if (!mime_type) throw new HttpException('Internal Server Error', 500);
          res.set({
            'Content-Type': mime_type,
          });
          return new StreamableFile(file);
        } else throw new HttpException('Internal Server Error', 500);
      }
    }
    const file = createReadStream(
      join(process.cwd(), '../avatars/default.jpg'),
    );
    if (file) {
      res.set({
        'Content-Type': 'image/jpg',
      });
      return new StreamableFile(file);
    } else throw new HttpException('Internal Server Error', 500);
  }
}

