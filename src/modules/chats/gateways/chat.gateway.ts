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
import { RoomChatDetailsService } from '../services/room-chat-details.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private memberRoomPrefix = (id, sessionId: any = '') =>
    `member-${id}-${sessionId}`;
  private supplierRoomPrefix = (id, sessionId: any = '') =>
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
    @Inject(RoomChatDetailsService)
    private readonly roomChatDetailService: RoomChatDetailsService,
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
    const routePrefix = socket.handshake.query.route_prefix;
    const sessionId = socket.handshake.query.session_id;
    let rooms = [];
    let authUser = null;

    try {
      if (!token || !routePrefix || !sessionId) {
        throw new BadRequestException('Please Fill Full Fields');
      }

      switch (routePrefix) {
        case ROUTE_PREFIX.MEMBER_PAGE:
          authUser = await this.membersService.verifyToken(token);

          // Save connected into database
          await this.connectedMembersService.save({
            session_id: sessionId,
            connected_id: socket.id,
            member_id: authUser.id,
          });

          // Get list rooms
          rooms = await this.roomChatsService.getListRoomChatByMemberId(
            authUser.id,
          );

          // Join auth member room and auth member room by session id
          socket.join([
            this.memberRoomPrefix(authUser.id),
            this.memberRoomPrefix(authUser.id, sessionId),
          ]);

          break;

        case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
          authUser = await this.expertsService.verifyToken(token);

          // Save connected into database
          await this.connectedExpertsService.save({
            session_id: sessionId,
            connected_id: socket.id,
            expert_id: authUser.id,
          });

          // Get list rooms
          rooms = await this.roomChatsService.getListRoomChatByExpertId(
            authUser.id,
          );

          // Join auth supplier room and auth supplier room by session id
          socket.join([
            this.supplierRoomPrefix(authUser.id),
            this.supplierRoomPrefix(authUser.id, sessionId),
          ]);

          break;
        default:
          throw new BadRequestException('Route Prefix is invalid');
      }

      socket.handshake.auth = authUser;
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
    const routePrefix = socket.handshake.query.route_prefix;

    try {
      switch (routePrefix) {
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
    const routePrefix = socket.handshake.query.route_prefix;
    const sessionId = socket.handshake.query.session_id;
    const auth = socket.handshake.auth;

    try {
      switch (routePrefix) {
        case ROUTE_PREFIX.MEMBER_PAGE:
          socket.to(this.memberRoomPrefix(auth.id, sessionId)).emit('logout');
          break;

        case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
          socket.to(this.supplierRoomPrefix(auth.id, sessionId)).emit('logout');
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
    let chatMessageData = {};
    const routePrefix = socket.handshake.query.route_prefix;
    const auth = socket.handshake.auth;

    try {
      switch (routePrefix) {
        case ROUTE_PREFIX.MEMBER_PAGE:
          chatMessageData = {
            room_chat_id,
            content,
            sender_id: auth.id,
            sender_status: 1,
            sender_type: 'Member',
            receiver_id: expert_id,
            receiver_status: 1,
            receiver_type: 'Expert',
            chat_time: moment(),
            type: 1,
          };

          break;
        case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
          chatMessageData = {
            room_chat_id,
            content,
            sender_id: auth.id,
            sender_status: 1,
            sender_type: 'Expert',
            receiver_id: member_id,
            receiver_status: 1,
            receiver_type: 'Member',
            chat_time: moment(),
            type: 1,
          };
          break;
        default:
          throw new BadRequestException('Route Prefix is invalid');
      }

      // Emit to client
      this.server
        .to(this.supplierRoomPrefix(expert_id))
        .emit('new-chat-message', this.gatewayResponder.ok(chatMessageData));

      this.server
        .to(this.memberRoomPrefix(member_id))
        .emit('new-chat-message', this.gatewayResponder.ok(chatMessageData));

      await this.roomChatDetailService.save(chatMessageData);
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'send-chat-message',
        this.gatewayResponder.badRequest(exception.message),
      );
    }
  }

  @SubscribeMessage('typing-chat-message')
  async onTypingChatMessage(
    socket: Socket,
    { room_chat_id, expert_id, member_id },
  ) {
    try {
      const routePrefix = socket.handshake.query.route_prefix;

      switch (routePrefix) {
        case ROUTE_PREFIX.MEMBER_PAGE:
          // Emit to supplier
          this.server
            .to(this.supplierRoomPrefix(expert_id))
            .emit(
              'typing-chat-message',
              this.gatewayResponder.ok({ room_chat_id }),
            );
          break;
        case ROUTE_PREFIX.SUPPLIER_DASHBOARD:
          // Emit to member
          this.server
            .to(this.memberRoomPrefix(member_id))
            .emit(
              'typing-chat-message',
              this.gatewayResponder.ok({ room_chat_id }),
            );
          break;
        default:
          throw new BadRequestException('Route Prefix is invalid');
      }
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'typing-chat-message',
        this.gatewayResponder.badRequest(exception.message),
      );
    }
  }
}
