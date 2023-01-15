import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Member } from './member.entity';
import { RoomChat } from './room-chat.entity';
import { Exclude } from 'class-transformer';

@Entity('ape_experts')
export class Expert extends BaseEntity {
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

  @Exclude()
  @Column()
  member_id: number;

  @Column()
  is_admin: number;

  @Column()
  status: number;

  @Exclude()
  @Column()
  token: string;

  @Exclude()
  @Column()
  created_token: string;

  /**
   * Relation: Member
   */
  @ManyToOne((type) => Member, (member) => member.experts)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  /**
   * Relation: RoomChats
   */
  @OneToMany((type) => RoomChat, (room_chat) => room_chat.expert)
  @JoinColumn({ name: 'expert_id' })
  room_chats: RoomChat[];
}
