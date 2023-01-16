import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {Expert} from "./expert.entity";
import { BaseEntity } from './base.entity';

@Entity('ape_connected_experts')
export class ConnectedExpert extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expert_id: number;

  @Column()
  connected_id: string;

  /**
   * Relation: Expert
   */
  @ManyToOne((type) => Expert, (expert) => expert.connected_experts)
  @JoinColumn({ name: 'expert_id' })
  expert: Expert;
}
