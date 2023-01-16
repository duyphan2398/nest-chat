import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Expert } from './expert.entity';
import { RoomChat } from './room-chat.entity';
import {Exclude, Expose, Transform} from 'class-transformer';
import {ConnectedMember} from "./connected-member.entity";

@Entity('ape_members')
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone_number: string;

  @Column()
  social_facebook_id: string;

  @Column()
  username: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  country_code: string;

  @Column()
  gender: number;

  @Column()
  birthday: string;

  @Column(
      {
        transformer: {
          to: (value: string) => value,
          from: (value: string) => value ? process.env.IMAGE_SERVER_DOMAIN + value : '',
        },
      }
  )
  avatar: string;

  @Exclude()
  @Column()
  token: string;

  @Exclude()
  @Column()
  created_token: string;

  @Column()
  is_verify: string;

  @Column()
  status: string;

  /**
   * Relation: Experts
   */
  @OneToMany((type) => Expert, (expert) => expert.member)
  @JoinColumn({ name: 'member_id' })
  experts: Expert[];

  /**
   * Relation: RoomChats
   */
  @OneToMany((type) => RoomChat, (room_chat) => room_chat.member)
  @JoinColumn({ name: 'member_id' })
  room_chats: RoomChat[];

  /**
   * Relation: ConnectedMembers
   */
  @OneToMany((type) => ConnectedMember, (connected_member) => connected_member.member)
  @JoinColumn({ name: 'member_id' })
  connected_members: ConnectedMember[];
}
