import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BadRequestException, Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MembersService } from '../services/members.service';
import { RoomChatsService } from '../services/room-chats.service';
import { ConnectedMembersService } from '../services/connected-members.service';
import { GatewayResponder } from '../../../core/response/gateway.response';
import { RoomChatDetailsService } from '../services/room-chat-details.service';
import { PARTNER_STATE } from '../enums/room-chats.enum';
import { SubscribeMessage } from '@nestjs/websockets';
import {
  RECEIVER_STATUS,
  ROOM_CHAT_DETAIL_TYPE,
  SENDER_STATUS,
} from '../enums/room-chat-details.enum';
import moment from 'moment';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private memberRoomPrefix = (id, sessionId: any = 'sessionId') =>
    `member-${id}-${sessionId}`;

  constructor(
    @Inject(MembersService) private readonly membersService: MembersService,
    @Inject(ConnectedMembersService)
    private readonly connectedMembersService: ConnectedMembersService,
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
    const sessionId = socket.handshake.query.session_id || '';
    let roomChats = [];
    let authUser = null;

    try {
      if (!token || !sessionId) {
        throw new BadRequestException('Please Fill Full Fields');
      }

      authUser = await this.membersService.verifyToken(token);

      // Save connected into database
      await this.connectedMembersService.save({
        session_id: sessionId,
        connected_id: socket.id,
        member_id: authUser.id,
      });

      // Get list rooms
      roomChats = await this.roomChatsService.getListRoomChatByMemberId(
        authUser.id,
      );

      // Join auth member room and auth member room by session id
      socket.join([
        this.memberRoomPrefix(authUser.id),
        this.memberRoomPrefix(authUser.id, sessionId),
      ]);

      // Emit online event to partner and Get state of partner
      let partnerId = null;
      for (const roomChat of roomChats) {
        partnerId =
          roomChat.member_id === authUser.id
            ? roomChat.partner_id
            : roomChat.member_id;

        socket.to(this.memberRoomPrefix(partnerId)).emit(
          'online',
          this.gatewayResponder.ok({
            room_chat_id: roomChat.id,
            member_id: authUser.id,
          }),
        );

        // Get state of partner
        const sockets = await this.server
          .in(this.memberRoomPrefix(partnerId))
          .fetchSockets();
        roomChat.partner_state = sockets?.length
          ? PARTNER_STATE.ONLINE
          : PARTNER_STATE.OFFLINE;
      }

      socket.handshake.auth = authUser;
      socket.emit('load-rooms', this.gatewayResponder.ok(roomChats));
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'handleConnection',
        this.gatewayResponder.unauthenticated(exception.message),
      );

      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    const authUser = socket.handshake.auth;
    let partnerId = null;

    try {
      // Check state of authUser
      const sockets = await this.server
        .in(this.memberRoomPrefix(authUser.id))
        .fetchSockets();

      // If this authUser offline completely  -> emit offline event
      if (!sockets?.length) {
        // Get list rooms
        const roomChats = await this.roomChatsService.getListRoomChatByMemberId(
          authUser.id,
        );

        // Emit offline event to partners
        for (const roomChat of roomChats) {
          partnerId =
            roomChat.member_id === authUser.id
              ? roomChat.partner_id
              : roomChat.member_id;

          socket.to(this.memberRoomPrefix(partnerId)).emit(
            'offline',
            this.gatewayResponder.ok({
              room_chat_id: roomChat.id,
              member_id: authUser.id,
            }),
          );
        }
      }

      // remove connection from DB
      await this.connectedMembersService.deleteByConnectedId(socket.id);

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
    const sessionId = socket.handshake.query.session_id;
    const authUser = socket.handshake.auth;

    try {
      socket.to(this.memberRoomPrefix(authUser.id, sessionId)).emit('logout');
      socket.disconnect();
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
    let roomChats = null;
    let partnerId = null;

    try {
      const newRoom = await this.roomChatsService.findByConditions({ id }, [
        'member',
        'partner',
      ]);
      if (!newRoom) {
        throw new BadRequestException('Room is not exist');
      }

      // Emit and join room to member
      if (newRoom?.member) {
        roomChats = await this.roomChatsService.getListRoomChatByMemberId(
          newRoom.member_id,
        );

        for (const roomChat of roomChats) {
          partnerId =
            roomChat.member_id === newRoom.member_id
              ? roomChat.partner_id
              : roomChat.member_id;

          // Get state of partner
          const sockets = await this.server
            .in(this.memberRoomPrefix(partnerId))
            .fetchSockets();
          roomChat.partner_state = sockets?.length
            ? PARTNER_STATE.ONLINE
            : PARTNER_STATE.OFFLINE;
        }

        this.server
          .to(this.memberRoomPrefix(newRoom.member_id))
          .emit('load-rooms', this.gatewayResponder.ok(roomChats));
      }

      // Emit to partner
      if (newRoom?.partner) {
        roomChats = await this.roomChatsService.getListRoomChatByMemberId(
          newRoom.partner_id,
        );

        for (const roomChat of roomChats) {
          partnerId =
            roomChat.member_id === newRoom.partner_id
              ? roomChat.partner_id
              : roomChat.member_id;

          // Get state of partner
          const sockets = await this.server
            .in(this.memberRoomPrefix(partnerId))
            .fetchSockets();
          roomChat.partner_state = sockets?.length
            ? PARTNER_STATE.ONLINE
            : PARTNER_STATE.OFFLINE;
        }

        this.server
          .to(this.memberRoomPrefix(newRoom.partner_id))
          .emit('load-rooms', this.gatewayResponder.ok(roomChats));
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
    { room_chat_id, content, partner_id, member_id },
  ) {
    const authUser = socket.handshake.auth;

    const chatMessageData = {
      room_chat_id,
      content,
      sender_id: authUser.id,
      sender_status: SENDER_STATUS.SEEN,
      receiver_id: partner_id == authUser.id ? member_id : partner_id,
      receiver_status: RECEIVER_STATUS.NOT_SEEN,
      chat_time: moment(),
      type: ROOM_CHAT_DETAIL_TYPE.TEXT,
    };

    try {
      // Emit to clients
      this.server
        .to(this.memberRoomPrefix(partner_id))
        .to(this.memberRoomPrefix(member_id))
        .emit('new-chat-message', this.gatewayResponder.ok(chatMessageData));

      // Save into database
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
    { room_chat_id, partner_id, member_id },
  ) {
    const authUser = socket.handshake.auth;
    try {
      // Emit to supplier
      this.server
        .to(
          this.memberRoomPrefix(
            partner_id == authUser.id ? member_id : partner_id,
          ),
        )
        .emit(
          'typing-chat-message',
          this.gatewayResponder.ok({ room_chat_id }),
        );
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'typing-chat-message',
        this.gatewayResponder.badRequest(exception.message),
      );
    }
  }

  @SubscribeMessage('seen-room')
  async onSeenRoom(socket: Socket, { room_chat_id }) {
    try {
      const authUser = socket.handshake.auth;

      // Emit to member
      this.server
        .to(this.memberRoomPrefix(authUser.id))
        .emit('seen-room', this.gatewayResponder.ok({ room_chat_id }));

      // Update seen room chat details
      await this.roomChatDetailService.update(
        {
          room_chat_id,
          receiver_id: authUser.id,
          receiver_status: RECEIVER_STATUS.NOT_SEEN,
        },
        {
          receiver_status: RECEIVER_STATUS.SEEN,
        },
      );
    } catch (exception) {
      ChatGateway.handleEmitErrorNotice(
        socket,
        'seen-room',
        this.gatewayResponder.badRequest(exception.message),
      );
    }
  }
}
