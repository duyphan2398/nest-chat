import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomChatDetail } from '../entities/room-chat-detail.entity';

@Injectable()
export class RoomChatDetailsService {
  constructor(
    @InjectRepository(RoomChatDetail)
    private roomChatDetailRepo: Repository<RoomChatDetail>,
  ) {}

  async getListRoomChatDetailByRoomId(roomId): Promise<RoomChatDetail[]> {
    return await this.roomChatDetailRepo
      .createQueryBuilder('room_chat_detail')
      .where('room_chat_detail.room_chat_id = :room_id', { room_id: roomId })
      .orderBy('room_chat_detail.created', 'ASC')
      .leftJoinAndSelect('room_chat_detail.room_chat', 'room_chat')
      .leftJoinAndSelect('room_chat.expert', 'expert')
      .leftJoinAndSelect('room_chat.member', 'member')
      .getMany();
  }
}
