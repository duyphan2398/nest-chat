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

  @Column({
    transformer: {
      to: (value: string) => value,
      from: (value: string) =>
        value ? process.env.IMAGE_SERVER_HOST + value : '',
    },
  })
  avatar: string;

  @Exclude()
  @Column({ select: false })
  token: string;

  @Exclude()
  @Column({ select: false })
  created_token: string;

  @Column()
  is_verify: number;

  @Column()
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
