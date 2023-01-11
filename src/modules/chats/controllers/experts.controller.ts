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
  NotFoundException
} from '@nestjs/common';
import { MembersService } from '../services/members.service';
import {MemberAuthGuard} from "../../../guards/member-auth.guard";
import {RequestInterface} from "../../../core/request/request.interface";


@Controller('expert')
export class ExpertsController {
  constructor(
      private readonly membersService: MembersService,
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
    return  await this.membersService.findOne(+id);
  }
}
