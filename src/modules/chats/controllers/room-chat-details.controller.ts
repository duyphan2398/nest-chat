import { Controller, Get, UseGuards, Req, Inject, Query } from '@nestjs/common';
import { MemberAuthGuard } from '../../../guards/member-auth.guard';
import { RequestInterface } from '../../../core/request/request.interface';
import { Responder } from '../../../core/response/responder.response';
import { RoomChatsService } from '../services/room-chats.service';
import { I18nService } from 'nestjs-i18n';
import { ApiGetRoomChatDetailsListDto } from '../dto/api/api-get-room-chat-details-list.dto';
import { RoomChatDetailsService } from '../services/room-chat-details.service';

@Controller()
export class RoomChatDetailsController {
  constructor(
    @Inject(RoomChatsService)
    private readonly roomChatsService: RoomChatsService,
    @Inject(RoomChatDetailsService)
    private readonly roomChatDetailsService: RoomChatDetailsService,
    @Inject(Responder) private readonly responder: Responder,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

  @Get('api/room-chat-details')
  @UseGuards(MemberAuthGuard)
  async apiGetList(
    @Req() request: RequestInterface,
    @Query() getRoomChatDetailsListDto: ApiGetRoomChatDetailsListDto,
  ) {
    const roomId = getRoomChatDetailsListDto.room_chat_id;
    const authMember = request.authMember;

    const roomChat = await this.roomChatsService.findByConditions({
      id: roomId,
      member_id: authMember.id,
    });

    if (!roomChat) {
      return this.responder.httpBadRequest(
        this.i18n.t('room-chat-error-messages.ROOM_CHAT_NOT_FOUND'),
      );
    }

    // Get List room chat detail
    try {
      const roomChatDetails =
        await this.roomChatDetailsService.getListRoomChatDetailByRoomId(roomId);
      return this.responder.httpOK(roomChatDetails);
    } catch (e) {
      return this.responder.httpBadRequest(e.message);
    }
  }
}
