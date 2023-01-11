import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Expert} from "../entities/expert.entity";
import {Repository} from "typeorm";
import {ExpertStatus} from "../enums/experts.enum";
import {Member} from "../entities/member.entity";

@Injectable()
export class ExpertsService  {
  constructor(
      @InjectRepository(Expert) private expertsRepo: Repository<Expert>
  ) {}

  async findAll(): Promise<Expert[]> {
    return await this.expertsRepo.find();
  }

  async findOne(id): Promise<Expert> {
    return await this.expertsRepo.findOneById(id);
  }

  async findByToken(token: string): Promise<Expert> {
    return await this.expertsRepo.createQueryBuilder('expert')
        .where('expert.token = :token', { token })
        .andWhere('expert.status = :status', { status: ExpertStatus.ENABLE })
        .getOne();
  }
}
