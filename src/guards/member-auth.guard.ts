import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import {MembersService} from "../modules/members/services/members.service";
import { I18nContext } from "nestjs-i18n";
import * as moment from 'moment';
import { TOKEN_EXPIRED_TIME } from "../modules/members/enums/member.enum";
import {RequestInterface} from "../core/request/request.interface";

export class MemberAuthGuard implements CanActivate {
  constructor(
      @Inject(MembersService) private readonly membersService: MembersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const token = request.headers.authorization || '';
    const i18n = I18nContext.current();


    // Check empty token
    if (!token)  {
      throw new UnauthorizedException(i18n.t('auth-error-messages.TOKEN_EMPTY'));
    }

    const authMember = await this.membersService.findByToken(token);


    // Check empty member
    if (!authMember) {
      throw new UnauthorizedException(i18n.t('auth-error-messages.TOKEN_WRONG'));
    }


    // Check token expired
    const expiredTime = moment(authMember.created_token).add(TOKEN_EXPIRED_TIME.SECONDS, 'seconds')
    const diffTime = moment().diff(expiredTime, 'seconds');
    if (!authMember.created_token || diffTime > 0 ) {
      throw new UnauthorizedException(i18n.t('auth-error-messages.TOKEN_EXPIRED'));
    }

    // Assign global auth user
    request.authMember = authMember;

    return true;
  }
}
