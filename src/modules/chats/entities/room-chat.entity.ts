import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Member } from './member.entity';
import { RoomChatDetail } from './room-chat-detail.entity';
import { BaseEntity } from './base.entity';

@Entity('ape_room_chats')
export class RoomChat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  member_id: number;

  @Column()
  partner_id: number;

  @Column()
  status: number;

  // Addition property
  partner_state: number;

  /**
   * Relation: Member
   */
  @ManyToOne((type) => Member, (member) => member.owner_room_chats)
  @JoinColumn({ name: 'member_id' })
  member: Member;


  /**
   * Relation: Partner
   */
  @ManyToOne((type) => Member, (member) => member.partner_room_chats)
  @JoinColumn({ name: 'partner_id' })
  partner: Member;

  /**
   * Relation: RoomChatDetail
   */
  @OneToMany(
    (type) => RoomChatDetail,
    (room_chat_detail) => room_chat_detail.room_chat,
  )
  @JoinColumn({ name: 'room_chat_id' })
  room_chat_details: RoomChatDetail[];
}
