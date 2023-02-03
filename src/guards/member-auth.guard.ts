import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { MembersService } from '../modules/chats/services/members.service';
import { RequestInterface } from '../core/request/request.interface';

export class MemberAuthGuard implements CanActivate {
  constructor(
    @Inject(MembersService) private readonly membersService: MembersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const token = request.headers.authorization || '';

    // Check token and assign global auth member
    request.authMember = await this.membersService.verifyToken(token);

    return true;
  }
}
