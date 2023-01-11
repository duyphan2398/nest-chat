import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Expert} from "../entities/expert.entity";
import {Repository} from "typeorm";
import {ExpertStatus} from "../enums/experts.enum";

@Injectable()
export class ExpertsService  {
  constructor(
      @InjectRepository(Expert) private expertsRepo: Repository<Expert>
  ) {}

  async findByToken(token: string): Promise<Expert> {
    return await this.expertsRepo.createQueryBuilder('expert')
        .where('expert.token = :token', { token })
        .andWhere('expert.status = :status', { status: ExpertStatus.ENABLE })
        .getOne();
  }
}
