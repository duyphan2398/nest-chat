import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { ExpertsService } from './services/experts.service';
import { MembersController } from './controllers/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Expert } from './entities/expert.entity';
import { ExpertsController } from './controllers/experts.controller';
import { Responder } from '../../core/response/responder.response';
import { RoomChat } from './entities/room-chat.entity';
import { RoomChatDetail } from './entities/room-chat-detail.entity';
import { RoomChatDetailImage } from './entities/room-chat-detail-image.entity';
import { RoomChatsController } from './controllers/room-chats.controller';
import { RoomChatsService } from './services/room-chats.service';
import { IsExpertExistConstraint } from './rules/exist-expert.rule';
import { ChatGateway } from './gateways/chat.gateway';
import { ConnectedMember } from './entities/connected-member.entity';
import { ConnectedExpert } from './entities/connected-expert.entity';
import { ConnectedExpertsService } from './services/connected-experts.service';
import { ConnectedMembersService } from './services/connected-members.service';
import {GatewayResponder} from "../../core/response/gateway.response";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      Expert,
      RoomChat,
      RoomChatDetail,
      RoomChatDetailImage,
      ConnectedMember,
      ConnectedExpert,
    ]),
  ],
  controllers: [MembersController, ExpertsController, RoomChatsController],
  providers: [
    IsExpertExistConstraint,
    ConnectedExpertsService,
    ConnectedMembersService,
    MembersService,
    ExpertsService,
    RoomChatsService,
    Responder,
    GatewayResponder,
    ChatGateway,
  ],
  exports: [MembersService, ExpertsService],
})
export class ChatsModule {}
