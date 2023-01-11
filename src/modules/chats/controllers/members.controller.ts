import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
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

  @Post()
  @UseGuards(MemberAuthGuard)
  async findAll(@Req() request: RequestInterface) {
    const authMember = request.authMember;
    return await this.membersService.findAll();
  }

  @Get(':id')
  @UseGuards(MemberAuthGuard)
  async findOne(@Param('id') id: string) {
    const member = await this.membersService.findOne(+id);
    return this.responder.httpNotFound();
  }
}
