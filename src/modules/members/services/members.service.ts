import { Injectable } from '@nestjs/common';
import {MembersRepository} from "../repositories/members.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Member} from "../entities/member.entity";

@Injectable()
export class MembersService {
  constructor(
      @InjectRepository(Member)
      private readonly membersRepository: MembersRepository,
  ) {
  }


  async findAll(): Promise<Member[]> {
    return await this.membersRepository.find();
  }
}
