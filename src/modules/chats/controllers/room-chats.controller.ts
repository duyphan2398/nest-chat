import { Controller, Post, UseGuards, Req, Inject, Body } from '@nestjs/common';
import { MemberAuthGuard } from '../../../guards/member-auth.guard';
import { RequestInterface } from '../../../core/request/request.interface';
import { Responder } from '../../../core/response/responder.response';
import { RoomChatsService } from '../services/room-chats.service';
import { I18nService } from 'nestjs-i18n';

@Controller()
export class RoomChatsController {
  constructor(
    @Inject(RoomChatsService)
    private readonly roomChatsService: RoomChatsService,
    @Inject(Responder) private readonly responder: Responder,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

  // @Post('api/room-chats')
  // @UseGuards(MemberAuthGuard)
  // async apiCreate(
  //   @Req() request: RequestInterface,
  //   @Body() createChatRoomDto: ApiCreateRoomChatDto,
  // ) {
  //   const authMember = request.authMember;
  //   const data = { member_id: authMember.id, ...createChatRoomDto };
  //   const existRoomChat = await this.roomChatsService.findByConditions(data);
  //
  //   if (existRoomChat) {
  //     return this.responder.httpBadRequest(
  //       this.i18n.t('room-chat-error-messages.ROOM_CHAT_EXISTED'),
  //     );
  //   }
  //
  //   // Create new room chat
  //   try {
  //     const roomChat = await this.roomChatsService.save(data);
  //     return this.responder.httpCreated(roomChat);
  //   } catch (e) {
  //     return this.responder.httpBadRequest(e.message);
  //   }
  // }
}
