import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RoomChat } from '../entities/room-chat.entity';
import { EXPERT_STATUS } from '../enums/experts.enum';
import { MEMBER_STATUS } from '../enums/members.enum';
import { RECEIVER_STATUS, SENDER_TYPE } from '../enums/room-chat-details.enum';
import { RoomChatDetail } from '../entities/room-chat-detail.entity';

@Injectable()
export class RoomChatsService {
  constructor(
    @InjectRepository(RoomChat) private roomChatsRepo: Repository<RoomChat>,
  ) {}

  async findByConditions(condition: object, relations = []): Promise<RoomChat> {
    return await this.roomChatsRepo.findOne({
      where: condition,
      relations,
    });
  }

  async findById(id): Promise<RoomChat> {
    return await this.roomChatsRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async getListRoomChatByMemberId(memberId): Promise<RoomChat[]> {
    return await this.roomChatsRepo
      .createQueryBuilder('room_chat')
      .loadRelationCountAndMap(
        'room_chat.not_seen_count',
        'room_chat.room_chat_details',
        'room_chat_details',
        (qb: SelectQueryBuilder<RoomChatDetail[]>) => {
          return qb
            .where('room_chat_details.sender_type = :sender_type', {
              sender_type: SENDER_TYPE.EXPERT,
            })
            .andWhere('room_chat_details.receiver_status = :receiver_status', {
              receiver_status: RECEIVER_STATUS.NOT_SEEN,
            });
        },
      )
      .leftJoinAndSelect('room_chat.expert', 'expert')
      .leftJoin('room_chat.room_chat_details', 'room_chat_details')
      .leftJoinAndSelect('room_chat.member', 'member')
      .where('room_chat.member_id = :member_id', { member_id: memberId })
      .andWhere('expert.status = :expert_status', {
        expert_status: EXPERT_STATUS.ENABLE,
      })
      .orderBy('room_chat.updated', 'DESC')
      .getMany();
  }

  async getListRoomChatByExpertId(expertId): Promise<RoomChat[]> {
    return await this.roomChatsRepo
      .createQueryBuilder('room_chat')
      .loadRelationCountAndMap(
        'room_chat.not_seen_count',
        'room_chat.room_chat_details',
        'room_chat_details',
        (qb: SelectQueryBuilder<RoomChatDetail[]>) => {
          return qb
            .where('room_chat_details.sender_type = :sender_type', {
              sender_type: SENDER_TYPE.MEMBER,
            })
            .andWhere('room_chat_details.receiver_status = :receiver_status', {
              receiver_status: RECEIVER_STATUS.NOT_SEEN,
            });
        },
      )
      .leftJoinAndSelect('room_chat.member', 'member')
      .leftJoin('room_chat.room_chat_details', 'room_chat_details')
      .leftJoinAndSelect('room_chat.expert', 'expert')
      .where('room_chat.expert_id = :expert_id', { expert_id: expertId })
      .andWhere('member.status = :member_status', {
        member_status: MEMBER_STATUS.ENABLE,
      })
      .orderBy('room_chat.updated', 'DESC')
      .getMany();
  }

  async save(data: object): Promise<RoomChat> {
    const roomChat = this.roomChatsRepo.create(data);
    return await this.roomChatsRepo.save(roomChat);
  }
}
