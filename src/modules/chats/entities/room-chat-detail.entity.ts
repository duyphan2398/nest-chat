import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { RoomChat } from './room-chat.entity';
import { RoomChatDetailImage } from './room-chat-detail-image.entity';
import { BaseEntity } from './base.entity';

@Entity('ape_room_chat_details')
export class RoomChatDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_chat_id: number;

  @Column()
  sender_id: number;

  @Column()
  sender_type: string;

  @Column()
  sender_status: number;

  @Column()
  receiver_id: number;

  @Column()
  receiver_type: string;

  @Column()
  receiver_status: number;

  @Column()
  chat_time: string;

  @Column()
  content: string;

  @Column()
  type: string;

  /**
   * Relation: RoomChats
   */
  @ManyToOne((type) => RoomChat, (room_chat) => room_chat.room_chat_details)
  @JoinColumn({ name: 'room_chat_id' })
  room_chat: RoomChat;

  /**
   * Relation: RoomChatDetailImage
   */
  @OneToOne(
    (type) => RoomChatDetailImage,
    (room_chat_detail_image) => room_chat_detail_image.room_chat_detail,
  )
  @JoinColumn({ name: 'room_chat_id' })
  room_chat_detail_image: RoomChatDetailImage;
}
