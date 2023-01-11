import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expert } from '../entities/expert.entity';
import { Repository } from 'typeorm';
import { ExpertStatus } from '../enums/experts.enum';
import { Member } from '../entities/member.entity';

@Injectable()
export class RoomChatsService {
  constructor(
    @InjectRepository(Expert) private expertsRepo: Repository<Expert>,
  ) {}
}
