import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomChatDetail } from '../entities/room-chat-detail.entity';
import { RoomChatDetailImage } from '../entities/room-chat-detail-image.entity';

@Injectable()
export class RoomChatDetailImagesService {
  constructor(
    @InjectRepository(RoomChatDetailImage)
    private roomChatDetailImageRepo: Repository<RoomChatDetailImage>,
  ) {}

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

  async save(file: any, authUser: any): Promise<RoomChatDetailImage> {
    const roomChatDetail = this.roomChatDetailImageRepo.create({
      member_id: authUser.id,
      ori_name: file.originalname,
      re_name: file.filename,
      size: file.size,
      type: file.mimetype,
      path: file.path,
    });
    return await this.roomChatDetailImageRepo.save(roomChatDetail);
  }
}
