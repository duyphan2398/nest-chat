import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { BaseEntity } from './base.entity';

@Entity('connected_members')
export class ConnectedMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  member_id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  connected_id: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  session_id: string;

  /**
   * Relation: Member
   */
  @ManyToOne((type) => Member, (member) => member.connected_members)
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
