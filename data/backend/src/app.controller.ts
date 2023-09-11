import {
  Controller,
  Body,
  Post,
  UploadedFile,
  Get,
  StreamableFile,
  Res,
  Param,
  Req,
  Query,
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

import { AuthenticatedGuard } from './auth/guards/intraAuthGuard.service';
import { UseGuards } from '@nestjs/common';

import { catchError, firstValueFrom } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UsersStatusService } from './services/users.status.service';
import { userStatus } from './users/userStatus';
import RequestWithUser from './auth/service/requestWithUser.interface';
import { User } from './entities';

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
    private readonly httpService: HttpService,
    private readonly userStatusArrayService: UsersStatusService,
  ) {}

  @Post('/avatar/upload')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file', fileInterceptorOptions))
  async uploadAvatar(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user as User;
    if (body && file) {
      if (user) {
        await this.userService.updateAvatar(user, file.path, false);
      } else throw new HttpException('Unprocessable Entity', 422);
    } else throw new HttpException('Bad Request', 400);
  }

  @Get('/avatar/')
  async getDefaultAvatar(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
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

  @Get('/avatar/:username')
  async getAvatar(
    @Param('username') username: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (username == null) {
      throw new HttpException('Bad Request', 400);
    }

    try {
      const user = await this.userService.findOne(username);
      if (user) {
        const path = user.urlAvatar;
        if (isUrl(path)) {
          res.redirect(path);
          return;
        }
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
    catch (e) {
      console.log(e);
    }
  }

  @Get(':username/status')
  @UseGuards(AuthenticatedGuard)
  async getUserStatus(
    @Param('username') username: string,
  ): Promise<userStatus> {
    if (username == null) throw new HttpException('Bad Request', 400);
    const user = await this.userService.findOne(username);
    if (!user) throw new HttpException('Unprocessable Entity', 422);
    const status = await this.userStatusArrayService.getUserStatus(
      user.username,
    );
    if (!status) return userStatus.offline;
    return status.status;
  }

  @Get(':username/friends/status')
  @UseGuards(AuthenticatedGuard)
  async getUserStatusFriendsList(@Param('username') username: string) {
    // TODO can't work without working friend list
    // if (username == null) throw new HttpException('Bad Request', 400);
    // const user = await this.userService.findOne(username);
    // if (!user) throw new HttpException('Unprocessable Entity', 422);
    // const friends = user.friendList;
    // const friendsList = [];
    // for (const friend of friends) {
    //   const status = await this.userStatusArrayService.getUserStatus(friend.uid1.username);
    //   if (status)
    //     friendsList.push({
    //       username: friend.uid1.username,
    //       status: status.status,
    //     });
    // }
    // return friendsList;
  }
}

export function isUrl(path: string): boolean {
  if (path.startsWith('http:/') || path.startsWith('https:/')) return true;
  else if (path.startsWith('www.')) return true;
  return false;
}
