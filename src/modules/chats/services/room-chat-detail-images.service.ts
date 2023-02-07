import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomChatDetailImage } from '../entities/room-chat-detail-image.entity';

@Injectable()
export class RoomChatDetailImagesService {
  constructor(
    @InjectRepository(RoomChatDetailImage)
    private roomChatDetailImageRepo: Repository<RoomChatDetailImage>,
  ) {}

  async findByConditions(
    condition: object,
    relations = [],
  ): Promise<RoomChatDetailImage> {
    return await this.roomChatDetailImageRepo.findOne({
      where: condition,
      relations,
    });
  }

  async findById(id: number): Promise<RoomChatDetailImage> {
    return await this.roomChatDetailImageRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByReName(reName: string): Promise<RoomChatDetailImage> {
    return await this.roomChatDetailImageRepo.findOne({
      where: {
        re_name: reName,
      },
    });
  }

  async save(data: object): Promise<RoomChatDetailImage> {
    const roomChatDetail = this.roomChatDetailImageRepo.create(data);
    return await this.roomChatDetailImageRepo.save(roomChatDetail);
  }
}
