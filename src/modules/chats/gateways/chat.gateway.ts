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
import * as moment from 'moment';

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
  private memberRoomPrefix = (id, sessionId = '') =>
    `member-${id}-${sessionId}`;
  private supplierRoomPrefix = (id, sessionId = '') =>
    `supplier-${id}-${sessionId}`;

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

  /**
   * Event: success-notice
   *
   * Fire success notice to client
   *
   * @param socket
   * @param nameOfEvent
   * @param response
   * @private
   */
  private static handleEmitSuccessNotice(
    socket: Socket,
    nameOfEvent = '',
    response: any = {},
  ) {
    socket.emit('success-notice', { nameOfEvent, ...response });
  }

  /**
   * Event: error-notice
   *
   * Fire error notice to client
   *
   * @param socket
   * @param nameOfEvent
   * @param response
   * @private
   */
  private static handleEmitErrorNotice(
    socket: Socket,
    nameOfEvent = '',
    response: any = {},
  ) {
    socket.emit('error-notice', { nameOfEvent, ...response });
  }

  /**
   * Listener: connected
   *
   * Handle incoming connected
   *
   * @param socket
   */
  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization || '';
    this.routePrefix = socket.handshake.query.route_prefix;
    this.sessionId = socket.handshake.query.session_id;
    let rooms = [];

    try {
      if (!token || !this.routePrefix || !this.sessionId) {
        throw new BadRequestException('Please Fill Full Fields');
      }

      switch (this.routePrefix) {
        case ROUTE_PREFIX.MEMBER_PAGE:
          this.authUser = await this.membersService.verifyToken(token);

          // Save connected into database
          await this.connectedMembersService.save({
            session_id: this.sessionId,
            connected_id: socket.id,
            member_id: this.authUser.id,
          });

          // Get list rooms
          rooms = await this.roomChatsService.getListRoomChatByMemberId(
            this.authUser.id,
          );

          // Join auth member room and auth member room by session id
          socket.join([
            this.memberRoomPrefix(this.authUser.id),
            this.memberRoomPrefix(this.authUser.id, this.sessionId),
          ]);

          break;

        case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
          this.authUser = await this.expertsService.verifyToken(token);

          // Save connected into database
          await this.connectedExpertsService.save({
            session_id: this.sessionId,
            connected_id: socket.id,
            expert_id: this.authUser.id,
          });

          // Get list rooms
          rooms = await this.roomChatsService.getListRoomChatByExpertId(
            this.authUser.id,
          );

          // Join auth supplier room and auth supplier room by session id
          socket.join([
            this.supplierRoomPrefix(this.authUser.id),
            this.supplierRoomPrefix(this.authUser.id, this.sessionId),
          ]);

          break;
        default:
          throw new BadRequestException('Route Prefix is invalid');
      }

      socket.emit('load-rooms', this.gatewayResponder.ok(rooms));
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
    try {
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
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'handleDisconnect',
        this.gatewayResponder.badRequest(exception.message),
      );
    }
  }

  @SubscribeMessage('logout')
  async onLogout(socket: Socket) {
    try {
      switch (this.routePrefix) {
        case ROUTE_PREFIX.MEMBER_PAGE:
          socket
            .to(this.memberRoomPrefix(this.authUser.id, this.sessionId))
            .emit('logout');
          break;

        case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
          socket
            .to(this.supplierRoomPrefix(this.authUser.id, this.sessionId))
            .emit('logout');
          break;

        default:
          throw new BadRequestException('Route Prefix is invalid');
      }
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'logout',
        this.gatewayResponder.badRequest(exception.message),
      );
    }
  }

  @SubscribeMessage('created-room')
  async onCreatedRoom(socket: Socket, { id }) {
    try {
      const newRoom = await this.roomChatsService.findByConditions({ id }, [
        'member',
        'expert',
      ]);
      if (!newRoom) {
        throw new BadRequestException('Room is not exist');
      }

      // Emit and join room to member
      if (newRoom?.member) {
        const memberRooms =
          await this.roomChatsService.getListRoomChatByMemberId(
            newRoom.member_id,
          );

        this.server
          .to(this.memberRoomPrefix(newRoom.member_id))
          .emit('load-rooms', this.gatewayResponder.ok(memberRooms));
      }

      // Emit to expert
      if (newRoom?.expert) {
        const supplierRooms =
          await this.roomChatsService.getListRoomChatByExpertId(
            newRoom.expert_id,
          );

        this.server
          .to(this.supplierRoomPrefix(newRoom.expert_id))
          .emit('load-rooms', this.gatewayResponder.ok(supplierRooms));
      }
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'created-room',
        this.gatewayResponder.badRequest(exception.message),
      );
    }
  }

  @SubscribeMessage('send-chat-message')
  async onSendChatMessage(
    socket: Socket,
    { room_chat_id, content, expert_id, member_id },
  ) {
    try {
      const chatMessageData = {
        room_chat_id,
        content,
        expert_id,
        member_id,
        chat_time: moment().format('YYYY-MM-DD HH:mm:ss').toString(),
        sender_type:
          this.routePrefix === ROUTE_PREFIX.MEMBER_PAGE ? 'Member' : 'Expert',
      };

      this.server
        .to(this.supplierRoomPrefix(expert_id))
        .emit('new-chat-message', this.gatewayResponder.ok(chatMessageData));

      this.server
        .to(this.memberRoomPrefix(member_id))
        .emit('new-chat-message', this.gatewayResponder.ok(chatMessageData));
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'send-chat-message',
        this.gatewayResponder.badRequest(exception.message),
      );
    }
  }
}
