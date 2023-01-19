import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { BadRequestException, Inject } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MembersService } from '../services/members.service';
import { RoomChatsService } from '../services/room-chats.service';
import { ConnectedMembersService } from '../services/connected-members.service';
import { ROUTE_PREFIX } from '../enums/chats.enum';
import { ExpertsService } from '../services/experts.service';
import { ConnectedExpertsService } from '../services/connected-experts.service';
import { GatewayResponder } from '../../../core/response/gateway.response';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private routePrefix;
  private sessionId;
  private authUser;

  constructor(
    @Inject(MembersService) private readonly membersService: MembersService,
    @Inject(ExpertsService) private readonly expertsService: ExpertsService,
    @Inject(ConnectedMembersService)
    private readonly connectedMembersService: ConnectedMembersService,
    @Inject(ConnectedExpertsService)
    private readonly connectedExpertsService: ConnectedExpertsService,
    @Inject(RoomChatsService)
    private readonly roomChatsService: RoomChatsService,
    @Inject(GatewayResponder)
    private readonly gatewayResponder: GatewayResponder,
  ) {}

  private static handleEmitSuccessNotice(
    socket: Socket,
    nameOfEvent = '',
    response: any = {},
  ) {
    socket.emit('success-notice', { nameOfEvent, ...response });
  }

  private static handleEmitErrorNotice(
    socket: Socket,
    nameOfEvent = '',
    response: any = {},
  ) {
    socket.emit('error-notice', { nameOfEvent, ...response });
  }

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization || '';
    this.routePrefix = socket.handshake.query.route_prefix;
    this.sessionId = socket.handshake.query.session_id;
    let auth = null;
    let rooms = [];

    try {
      if (!token || !this.routePrefix || !this.sessionId) {
        throw new BadRequestException('Please Fill Full Fields');
      }

      switch (this.routePrefix) {
        case ROUTE_PREFIX.MEMBER_PAGE:
          this.authUser = await this.membersService.verifyToken(token);
          await this.connectedMembersService.save({
            session_id: this.sessionId,
            connected_id: socket.id,
            member_id: this.authUser.id,
          });
          rooms = await this.roomChatsService.getListRoomChatByMemberId(
              this.authUser.id,
          );



          break;

        case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
          this.authUser = await this.expertsService.verifyToken(token);
          await this.connectedExpertsService.save({
            session_id: this.sessionId,
            connected_id: socket.id,
            expert_id: this.authUser.id,
          });
          rooms = await this.roomChatsService.getListRoomChatByExpertId(
              this.authUser.id,
          );

          break;
        default:
          throw new BadRequestException('Route Prefix is invalid');
      }

      socket.emit('load-rooms', rooms);
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'handleConnection',
        this.gatewayResponder.unauthenticated(exception.message),
      );

      await this.handleDisconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    switch (this.routePrefix) {
      case ROUTE_PREFIX.MEMBER_PAGE:
        // remove connection from DB
        await this.connectedMembersService.deleteByConnectedId(socket.id);
        break;

      case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
        // remove connection from DB
        await this.connectedExpertsService.deleteByConnectedId(socket.id);
        break;
    }

    socket.disconnect();
  }

  @SubscribeMessage('logout')
  async onLogout(socket: Socket) {
    switch (this.routePrefix) {
      case ROUTE_PREFIX.MEMBER_PAGE:
        let connectedMembers = await this.connectedMembersService.findManyByConditions({
          'session_id': this.sessionId,
          'member_id' : this.authUser.id
        });

        if (connectedMembers) {
          for (const connectedMember of connectedMembers) {
            this.server.to(connectedMember.connected_id).emit('logout-and-clear-data');
          }
        }
        break;

      case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
        let connectedExperts = await this.connectedExpertsService.findManyByConditions({
          'session_id': this.sessionId,
          'member_id' : this.authUser.id
        });

        if (connectedExperts) {
          for (const connectedExpert of connectedExperts) {
            this.server.to(connectedExpert.connected_id).emit('logout-and-clear-data');
          }
        }
        break;
      default:
        throw new BadRequestException('Route Prefix is invalid');
    }
  }


  @SubscribeMessage('created-room')
  async onCreatedRoom(socket: Socket, { id, member_id, expert_id }) {
    try {
      let newRoom = await this.roomChatsService.findByConditions({ id }, ['member.connected_members', 'expert.connected_experts'])
      if (!newRoom){
        throw new BadRequestException('Room is not exist');
      }

      // Emit to member
      if (newRoom?.member?.connected_members){
        let connectedMembers = newRoom.member.connected_members
        let rooms = await this.roomChatsService.getListRoomChatByMemberId(
            newRoom.member_id,
        );
        for (const connectedMember of connectedMembers) {
          this.server.to(connectedMember.connected_id).emit('load-rooms', rooms);
        }
      }

      // Emit to expert
      if (newRoom?.expert?.connected_experts){
        let connectedExperts = newRoom.expert.connected_experts
        let rooms = await this.roomChatsService.getListRoomChatByExpertId(
            newRoom.expert_id,
        );
        for (const connectedExpert of connectedExperts) {
          this.server.to(connectedExpert.connected_id).emit('load-rooms', rooms);
        }
      }

    } catch (e) {
      console.log(e)
    }
  }
}
