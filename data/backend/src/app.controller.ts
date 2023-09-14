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
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpException } from '@nestjs/common';

import { createReadStream } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

import { UsersService } from './users/users.service';
import { Response } from 'express';
import { AppService } from './services/app.service';

import { AuthenticatedGuard } from './auth/guards/intraAuthGuard.service';
import { UseGuards } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { UsersStatusService } from './services/users.status.service';
import { userStatus } from './users/userStatus';
import RequestWithUser from './auth/service/requestWithUser.interface';
import { User } from './entities';
import { promises as fs } from 'fs';

const fileInterceptorOptions = {
  fileFilter: function fileFilter(req, file: Express.Multer.File, cb) {
    console.log('fileinterceptor');
    const whitelist = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];
    if (!file) return cb(new BadRequestException('No file provided'), false);
    if (!whitelist.includes(file.mimetype))
      return cb(
        new UnsupportedMediaTypeException(
          'No files other than jpg/png/jpeg/gif are accepted',
        ),
        false,
      );
    cb(null, true);
  },
  limits: {
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
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    console.log('changeAvatar');
    const user = req.user as User;
    if (body && file) {
      if (!validImage(file)) {
        throw new HttpException('Unprocessable Entity', 400);
      }
      if (user) {
        const path = '/avatars/';
        if (file.mimetype.includes('image/'))
          file.mimetype = file.mimetype.slice(6);
        const name = randomUUID() + '.' + file.mimetype;
        try {
          await fs.writeFile(path + name, file.buffer);
        } catch (err) {
          throw new HttpException('Internal Server Error', 500);
        }
        await this.userService.updateAvatar(
          user,
          path + name,
          isUrl(user.urlAvatar),
        );
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
            if (!mime_type)
              throw new HttpException('Internal Server Error', 500);
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
    } catch (e) {
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
}

export function isUrl(path: string): boolean {
  if (path.startsWith('http:/') || path.startsWith('https:/')) return true;
  else if (path.startsWith('www.')) return true;
  return false;
}

function validImage(file: Express.Multer.File): boolean {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    if (
      file.buffer[0] !== 0xff ||
      file.buffer[1] !== 0xd8 ||
      file.buffer[2] !== 0xff
    )
      return false;
  } else if (file.mimetype === 'image/png') {
    if (
      file.buffer[0] !== 0x89 ||
      file.buffer[1] !== 0x50 ||
      file.buffer[2] !== 0x4e ||
      file.buffer[3] !== 0x47 ||
      file.buffer[4] !== 0x0d ||
      file.buffer[5] !== 0x0a ||
      file.buffer[6] !== 0x1a ||
      file.buffer[7] !== 0x0a
    )
      return false;
  } else if (file.mimetype === 'image/gif') {
    if (
      file.buffer[0] !== 0x47 ||
      file.buffer[1] !== 0x49 ||
      file.buffer[2] !== 0x46 ||
      file.buffer[3] !== 0x38 ||
      file.buffer[4] !== 0x39 ||
      file.buffer[5] !== 0x61
    )
      return false;
  } else return false;
  return true;
}
