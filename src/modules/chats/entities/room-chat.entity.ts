import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Member } from './member.entity';
import { Expert } from './expert.entity';
import { RoomChatDetail } from './room-chat-detail.entity';

@Entity('ape_room_chats')
export class RoomChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  member_id: string;

  @Column()
  expert_id: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created: string;

  @UpdateDateColumn()
  updated: string;

  /**
   * Relation: Member
   */
  @ManyToOne((type) => Member, (member) => member.room_chats)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  /**
   * Relation: Expert
   */
  @ManyToOne((type) => Expert, (expert) => expert.room_chats)
  @JoinColumn({ name: 'expert_id' })
  expert: Member;

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
