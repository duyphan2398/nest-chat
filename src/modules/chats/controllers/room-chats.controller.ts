import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Inject, Body,
} from '@nestjs/common';
import { MembersService } from '../services/members.service';
import { MemberAuthGuard } from '../../../guards/member-auth.guard';
import { RequestInterface } from '../../../core/request/request.interface';
import { Responder } from '../../../core/response/responder.response';
import {RoomChatsService} from "../services/room-chats.service";
import {CreateRoomChatDto} from "../dto/members/create-room-chat.dto";

@Controller()
export class RoomChatsController {
  constructor(
    @Inject(RoomChatsService) private readonly roomChatsService: RoomChatsService,
    @Inject(Responder) private readonly responder: Responder,

  ) {}

  @Post('api/room-chats')
  @UseGuards(MemberAuthGuard)
  async create(
      @Req() request: RequestInterface,
      @Body() createChatRoomDto: CreateRoomChatDto
  ) {
    console.log(createChatRoomDto)
    const authMember = request.authMember;
  }
}
