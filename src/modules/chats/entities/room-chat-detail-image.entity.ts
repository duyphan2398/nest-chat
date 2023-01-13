import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { RoomChat } from './room-chat.entity';
import { RoomChatDetail } from './room-chat-detail.entity';
import {BaseEntity} from "./base.entity";

@Entity('ape_room_chat_detail_images')
export class RoomChatDetailImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_chat_detail_id: number;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column()
  width: number;

  @Column()
  height: number;

  /**
   * Relation: RoomChatDetail
   */
  @OneToOne(
    (type) => RoomChatDetail,
    (room_chat_detail) => room_chat_detail.room_chat_detail_image,
  )
  @JoinColumn({ name: 'room_chat_detail_id' })
  room_chat_detail: RoomChat;
}
