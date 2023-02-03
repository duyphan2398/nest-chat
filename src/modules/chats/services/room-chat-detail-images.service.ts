import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomChatDetail } from '../entities/room-chat-detail.entity';
import { RoomChatDetailImage } from '../entities/room-chat-detail-image.entity';

@Injectable()
export class RoomChatDetailImagesService {
  constructor(
    @InjectRepository(RoomChatDetail)
    private roomChatDetailImageRepo: Repository<RoomChatDetailImage>,
  ) {}
}
