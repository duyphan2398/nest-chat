import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Member} from "../entities/member.entity";
import {Repository} from "typeorm";
import {MemberIsVerify, MemberStatus} from "../enums/member.enum";

@Injectable()
export class MembersService  {
  constructor(
      @InjectRepository(Member) private membersRepo: Repository<Member>
  ) {}

  async findAll(): Promise<Member[]> {
    return await this.membersRepo.find();
  }

  async findOne(id): Promise<Member> {
    return await this.membersRepo.findOneById(id);
  }

  async findByToken(token: string): Promise<Member> {
    return await this.membersRepo.createQueryBuilder('member')
        .where('member.token = :token', { token })
        .andWhere('member.is_verify = :is_verify', { is_verify: MemberIsVerify.VERIFY })
        .andWhere('member.status = :status', { status: MemberStatus.ENABLE })
        .getOne();
  }
}
