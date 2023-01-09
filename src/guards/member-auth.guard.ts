import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import {MembersService} from "../modules/members/services/members.service";
import { I18nContext } from "nestjs-i18n";
import {MomentProvider} from "../providers/moment.provider";


export class MemberAuthGuard implements CanActivate {
  constructor(
      @Inject(MembersService) private readonly membersService: MembersService, private readonly momentProvider: MomentProvider
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
    console.log(authMember.created_token)
    console.log( new Date(authMember.created_token) < new Date() );
    console.log(this.momentProvider.moment.now())


    return true;
  }
}
