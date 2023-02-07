import { Member } from './member.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { RoomChat } from './room-chat.entity';
import { RoomChatDetail } from './room-chat-detail.entity';
import { BaseEntity } from './base.entity';

@Entity('ape_room_chat_detail_images')
export class RoomChatDetailImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_chat_detail_id: number;

  @Column()
  member_id: number;

  @Column()
  ori_name: string;

  @Column()
  re_name: string;

  @Column()
  size: number;

  @Column()
  type: string;

  @Column({
    transformer: {
      to: (value: string) => value,
      from: (value: string) =>
        value ? process.env.CURRENT_HOST + '/' + value : '',
    },
  })
  path: string;

  /**
   * Relation: RoomChatDetail
   */
  @OneToOne(
    (type) => RoomChatDetail,
    (room_chat_detail) => room_chat_detail.room_chat_detail_image,
  )
  @JoinColumn({ name: 'room_chat_detail_id' })
  room_chat_detail: RoomChat;

  /**
   * Relation: RoomChatDetail
   */
  @ManyToOne((type) => Member, (member) => member.room_chat_detail_images)
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
