import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req, NotFoundException
} from '@nestjs/common';
import { MembersService } from '../services/members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import {MemberAuthGuard} from "../../../guards/member-auth.guard";
import {RequestInterface} from "../../../core/request/request.interface";


@Controller('members')
export class MembersController {
  constructor(
      private readonly membersService: MembersService,
  ) {}
  //
  // @Post()
  // create(@Body() createMemberDto: CreateMemberDto) {
  //   return this.membersService.create(createMemberDto);
  // }

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
  //   return this.membersService.update(+id, updateMemberDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.membersService.remove(+id);
  // }
}
