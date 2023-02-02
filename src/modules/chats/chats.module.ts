import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Responder } from '../../core/response/responder.response';
import { RoomChat } from './entities/room-chat.entity';
import { RoomChatDetail } from './entities/room-chat-detail.entity';
import { RoomChatDetailImage } from './entities/room-chat-detail-image.entity';
import { RoomChatsController } from './controllers/room-chats.controller';
import { RoomChatsService } from './services/room-chats.service';
import { ChatGateway } from './gateways/chat.gateway';
import { ConnectedMember } from './entities/connected-member.entity';
import { ConnectedMembersService } from './services/connected-members.service';
import { GatewayResponder } from '../../core/response/gateway.response';
import { IsMemberExistConstraint } from './rules/exist-member.rule';
import { RoomChatDetailsController } from './controllers/room-chat-details.controller';
import { IsRoomChatExistConstraint } from './rules/exist-room-chat.rule';
import { RoomChatDetailsService } from './services/room-chat-details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      RoomChat,
      RoomChatDetail,
      RoomChatDetailImage,
      ConnectedMember,
    ]),
  ],
  controllers: [
    MembersController,
    RoomChatsController,
    RoomChatDetailsController,
  ],
  providers: [
    IsRoomChatExistConstraint,
    IsMemberExistConstraint,
    ConnectedMembersService,
    MembersService,
    RoomChatsService,
    RoomChatDetailsService,
    Responder,
    GatewayResponder,
    ChatGateway,
  ],
  exports: [MembersService],
})
export class ChatsModule {}
