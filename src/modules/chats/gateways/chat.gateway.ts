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
    let auth = null;
    let rooms = [];

    try {
      if (!token || !this.routePrefix) {
        throw new BadRequestException('Please Fill Full Fields');
      }

      switch (this.routePrefix) {
        case ROUTE_PREFIX.MEMBER_PAGE:
          auth = await this.membersService.verifyToken(token);
          await this.connectedMembersService.save({
            connected_id: socket.id,
            member_id: auth.id,
          });
          rooms = await this.roomChatsService.getListRoomChatByMemberId(
            auth.id,
          );
          break;

        case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
          auth = await this.expertsService.verifyToken(token);
          await this.connectedExpertsService.save({
            connected_id: socket.id,
            expert_id: auth.id,
          });
          rooms = await this.roomChatsService.getListRoomChatByExpertId(
            auth.id,
          );

          break;
        default:
          throw new BadRequestException('Route Prefix is invalid');
      }

      socket.data.auth = auth;

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

  @SubscribeMessage('created-room')
  async onCreatedRoom(socket: Socket, { id, member_id, expert_id }) {
    console.log(id);
    console.log(member_id);
    console.log(expert_id);

    for (const user of createdRoom.users) {
      const connections: ConnectedUserI[] =
        await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id);
      // substract page -1 to match the angular material paginator
      rooms.meta.currentPage = rooms.meta.currentPage - 1;
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }
}
