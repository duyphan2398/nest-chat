import { RoomChatDetailImage } from './room-chat-detail-image.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { RoomChat } from './room-chat.entity';
import { Exclude } from 'class-transformer';
import { ConnectedMember } from './connected-member.entity';

@Entity('members')
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  country_code: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  phone_number: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  full_name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
    transformer: {
      to: (value: string) => value,
      from: (value: string) =>
        value ? process.env.IMAGE_SERVER_HOST + value : '',
    },
  })
  avatar: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
    select: false,
  })
  token: string;

  @Exclude()
  @Column({
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  created_token: string;

  @Column({
    type: 'tinyint',
    nullable: false,
    select: false,
  })
  is_verify: number;

  @Column({
    type: 'tinyint',
    nullable: false,
  })
  status: number;

  /**
   * Relation: RoomChats (Owner)
   */
  @OneToMany((type) => RoomChat, (room_chat) => room_chat.member)
  @JoinColumn({ name: 'member_id' })
  owner_room_chats: RoomChat[];

  /**
   * Relation: RoomChats (Partner)
   */
  @OneToMany((type) => RoomChat, (room_chat) => room_chat.partner)
  @JoinColumn({ name: 'partner_id' })
  partner_room_chats: RoomChat[];

  /**
   * Relation: ConnectedMembers
   */
  @OneToMany(
    (type) => ConnectedMember,
    (connected_member) => connected_member.member,
  )
  @JoinColumn({ name: 'member_id' })
  connected_members: ConnectedMember[];

  /**
   * Relation: RoomChatDetailImages
   */
  @OneToMany(
    (type) => RoomChatDetailImage,
    (room_chat_detail_image) => room_chat_detail_image.member,
  )
  @JoinColumn({ name: 'member_id' })
  room_chat_detail_images: RoomChatDetailImage[];
}
