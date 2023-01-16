import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {Member} from "./member.entity";
import { BaseEntity } from './base.entity';

@Entity('ape_connected_members')
export class ConnectedMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  member_id: number;

  @Column()
  connected_id: string;


  /**
   * Relation: Member
   */
  @ManyToOne((type) => Member, (member) => member.connected_members)
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
