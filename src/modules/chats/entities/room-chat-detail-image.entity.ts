import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { RoomChat } from './room-chat.entity';
import { RoomChatDetail } from './room-chat-detail.entity';

@Entity('ape_room_chat_detail_images')
export class RoomChatDetailImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  job_title: string;

  @Column()
  expert_avatar: string;

  @Column()
  member_id: number;

  @Column()
  is_admin: number;

  @Column()
  status: string;

  @Column()
  token: string;

  @Column()
  created_token: string;

  // --- RELATIONS
  // RoomChatDetail
  @OneToOne(
    (type) => RoomChatDetail,
    (room_chat_detail) => room_chat_detail.room_chat_detail_image,
  )
  @JoinColumn({ name: 'room_chat_detail_id' })
  room_chat_detail: RoomChat;
}
