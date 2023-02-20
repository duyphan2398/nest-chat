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

@Entity('room_chat_details')
export class RoomChatDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  room_chat_id: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  sender_id: number;

  @Column({
    type: 'tinyint',
    nullable: false,
  })
  sender_status: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  receiver_id: number;

  @Column({
    type: 'tinyint',
    nullable: false,
  })
  receiver_status: number;

  @Column({
    type: 'datetime',
    nullable: false,
    transformer: {
      to: (value) => {
        return new Date(value);
      },
      from: (value) => value,
    },
  })
  chat_time: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'int',
    nullable: false,
  })
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
  @JoinColumn({ name: 'id', referencedColumnName: 'room_chat_detail_id' })
  room_chat_detail_image: RoomChatDetailImage;
}
