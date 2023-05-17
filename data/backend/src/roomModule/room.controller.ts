import { Controller, Get, Query } from '@nestjs/common';
import { RoomService } from './room.service';


@Controller('/api/chat/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}


}