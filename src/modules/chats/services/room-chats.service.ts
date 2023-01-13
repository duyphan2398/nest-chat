import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import {RoomChat} from "../entities/room-chat.entity";

@Injectable()
export class RoomChatsService {
  constructor(
    @InjectRepository(RoomChat) private roomChatsRepo: Repository<RoomChat>,
  ) {}

  async findByConditions(condition: object): Promise<RoomChat> {
    return await this.roomChatsRepo.findOne({
      where: condition
    });
  }

  async save(data: object): Promise<RoomChat>{
    const roomChat = this.roomChatsRepo.create(data);
    return await this.roomChatsRepo.save(roomChat);
  }
}
