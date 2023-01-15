import { Controller, Get, UseGuards, Req, Inject } from '@nestjs/common';
import { MembersService } from '../services/members.service';
import { MemberAuthGuard } from '../../../guards/member-auth.guard';
import { RequestInterface } from '../../../core/request/request.interface';
import { Responder } from '../../../core/response/responder.response';

@Controller()
export class MembersController {
  constructor(
    @Inject(MembersService) private readonly membersService: MembersService,
    @Inject(Responder) private readonly responder: Responder,
  ) {}

  @Get('/api/members/profile')
  @UseGuards(MemberAuthGuard)
  async apiProfile(@Req() request: RequestInterface) {
    const authMember = request.authMember;
    return this.responder.httpOK(authMember);
  }
}
