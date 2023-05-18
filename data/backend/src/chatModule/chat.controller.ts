import { Controller, Get, Query } from '@nestjs/common';
import { RoomService } from './room.service';


@Controller('/api/chat/')
export class ChatController {
  constructor(private readonly roomService: RoomService) {}


}