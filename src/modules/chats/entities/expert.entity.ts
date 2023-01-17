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
import { Exclude, Expose, Transform } from 'class-transformer';
import { ConnectedExpert } from './connected-expert.entity';
import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

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

  @Column({
    transformer: {
      to: (value: string) => value,
      from: (value: string) =>
        value ? process.env.IMAGE_SERVER_DOMAIN + value : '',
    },
  })
  expert_avatar: string;

  @Exclude()
  @Column()
  member_id: number;

  @Column()
  is_admin: number;

  @Column()
  status: number;

  @Exclude()
  @Column({ select: false })
  token: string;

  @Exclude()
  @Column({ select: false })
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

  /**
   * Relation: ConnectedExperts
   */
  @OneToMany(
    (type) => ConnectedExpert,
    (connected_expert) => connected_expert.expert,
  )
  @JoinColumn({ name: 'expert_id' })
  connected_experts: ConnectedExpert[];
}
