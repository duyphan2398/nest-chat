import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { MembersService } from '../services/members.service';
import { MemberAuthGuard } from '../../../guards/member-auth.guard';
import { RequestInterface } from '../../../core/request/request.interface';
import { Responder } from '../../../core/response/responder.response';

@Controller('members')
export class MembersController {
  constructor(
    @Inject(MembersService) private readonly membersService: MembersService,
    @Inject(Responder) private readonly responder: Responder,
  ) {}

  @Get('profile')
  @UseGuards(MemberAuthGuard)
  async getProfile(@Req() request: RequestInterface) {
    const authMember = request.authMember;
    return this.responder.httpOK(authMember);
  }
}
