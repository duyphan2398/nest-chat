import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import {MembersService} from "../modules/members/services/members.service";
import { I18nContext } from "nestjs-i18n";
import {MomentProvider} from "../providers/moment.provider";
import { TOKEN_EXPIRED_TIME } from "../modules/members/enums/member.enum";

export class MemberAuthGuard implements CanActivate {
  constructor(
      @Inject(MembersService) private readonly membersService: MembersService,
      @Inject(MomentProvider) private readonly momentProvider: MomentProvider
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
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
    const moment = this.momentProvider.moment;
    const expiredTime = moment(authMember.created_token).add(TOKEN_EXPIRED_TIME.SECONDS, 'seconds')
    const diffTime = moment().diff(expiredTime, 'seconds');
    console.log( moment());
    console.log(diffTime);


    return true;
  }
}
