import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expert } from '../entities/expert.entity';
import { Repository } from 'typeorm';
import { EXPERT_STATUS, TOKEN_EXPIRED_TIME } from '../enums/experts.enum';
import * as moment from 'moment/moment';
import { I18nService } from 'nestjs-i18n';
import {Member} from "../entities/member.entity";
import {MEMBER_IS_VERIFY, MEMBER_STATUS} from "../enums/members.enum";

@Injectable()
export class ExpertsService {
  constructor(
    @InjectRepository(Expert) private expertsRepo: Repository<Expert>,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

  async findByConditions(condition: object): Promise<Expert> {
    return await this.expertsRepo.findOne({
      where: condition,
    });
  }

  async findById(id): Promise<Expert> {
    return await this.expertsRepo.findOne({
      where: {
        id,
        status: EXPERT_STATUS.ENABLE,
      },
    });
  }

  private async findByToken(token: string): Promise<Expert> {
    return await this.expertsRepo
      .createQueryBuilder('expert')
      .addSelect(['expert.token', 'expert.created_token'])
      .where('expert.token = :token', { token })
      .andWhere('expert.status = :status', { status: EXPERT_STATUS.ENABLE })
      .getOne();
  }

  async verifyToken(token: string | null): Promise<Expert> {
    if (!token) {
      throw new UnauthorizedException(
        this.i18n.t('auth-error-messages.TOKEN_EMPTY'),
      );
    }

    const authExpert = await this.findByToken(token);

    // Check empty expert
    if (!authExpert) {
      throw new UnauthorizedException(
        this.i18n.t('auth-error-messages.TOKEN_WRONG'),
      );
    }

    // Check token expired
    const expiredTime = moment(authExpert.created_token).add(
      TOKEN_EXPIRED_TIME.SECONDS,
      'seconds',
    );
    const diffTime = moment().diff(expiredTime, 'seconds');

    if (!authExpert.created_token || diffTime > 0) {
      throw new UnauthorizedException(
        this.i18n.t('auth-error-messages.TOKEN_EXPIRED'),
      );
    }

    return authExpert;
  }
}
