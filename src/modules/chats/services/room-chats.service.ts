import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomChat } from '../entities/room-chat.entity';
import { ExpertStatus } from '../enums/experts.enum';

@Injectable()
export class RoomChatsService {
  constructor(
    @InjectRepository(RoomChat) private roomChatsRepo: Repository<RoomChat>,
  ) {}

  async getListRoomChatByMemberId(memberId): Promise<RoomChat[]> {
    return await this.roomChatsRepo
      .createQueryBuilder('room_chat')
      .leftJoinAndSelect('room_chat.expert', 'expert')
      .where('room_chat.member_id = :member_id', { member_id: memberId })
      .where('expert.status = :expert_status', {
        expert_status: ExpertStatus.ENABLE,
      })
      .orderBy('room_chat.updated', 'DESC')
      .getMany();
  }

  async findByConditions(condition: object): Promise<RoomChat> {
    return await this.roomChatsRepo.findOne({
      where: condition,
    });
  }

  async save(data: object): Promise<RoomChat> {
    const roomChat = this.roomChatsRepo.create(data);
    return await this.roomChatsRepo.save(roomChat);
  }
}
