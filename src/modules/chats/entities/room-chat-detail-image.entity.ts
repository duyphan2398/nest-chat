import { Member } from './member.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { RoomChatDetail } from './room-chat-detail.entity';
import { BaseEntity } from './base.entity';

@Entity('room_chat_detail_images')
export class RoomChatDetailImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  room_chat_detail_id: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  member_id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  ori_name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  re_name: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  size: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  type: string;

  @Column({
    type: 'text',
    nullable: false,
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
  room_chat_detail: RoomChatDetail;

  /**
   * Relation: RoomChatDetail
   */
  @ManyToOne((type) => Member, (member) => member.room_chat_detail_images)
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
