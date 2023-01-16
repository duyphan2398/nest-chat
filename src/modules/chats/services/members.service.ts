import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { Repository } from 'typeorm';
import {MemberIsVerify, MemberStatus, TOKEN_EXPIRED_TIME} from '../enums/members.enum';
import * as moment from "moment/moment";
import {I18nService} from "nestjs-i18n";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private membersRepo: Repository<Member>,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

  async findAll(): Promise<Member[]> {
    return await this.membersRepo.find();
  }

  async findOne(id): Promise<Member> {
    return await this.membersRepo.findOneById(id);
  }

  async findByToken(token: string): Promise<Member> {
    return await this.membersRepo
      .createQueryBuilder('member')
      .where('member.token = :token', { token })
      .andWhere('member.is_verify = :is_verify', {
        is_verify: MemberIsVerify.VERIFY,
      })
      .andWhere('member.status = :status', { status: MemberStatus.ENABLE })
      .getOne();
  }

  async verifyToken(token: string|null): Promise<Member> {
    // Check empty token
    if (!token) {
      throw new UnauthorizedException(
          this.i18n.t('auth-error-messages.TOKEN_EMPTY'),
      );
    }

    const authMember = await this.findByToken(token);

    // Check empty member
    if (!authMember) {
      throw new UnauthorizedException(
          this.i18n.t('auth-error-messages.TOKEN_WRONG'),
      );
    }

    // Check token expired
    const expiredTime = moment(authMember.created_token).add(
        TOKEN_EXPIRED_TIME.SECONDS,
        'seconds',
    );
    const diffTime = moment().diff(expiredTime, 'seconds');
    if (!authMember.created_token || diffTime > 0) {
      throw new UnauthorizedException(
          this.i18n.t('auth-error-messages.TOKEN_EXPIRED'),
      );
    }

    return authMember;
  }
}
