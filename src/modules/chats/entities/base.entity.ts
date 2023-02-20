import {
  BaseEntity as TypeOrmBaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as moment from 'moment';
import { BeforeInsert, BeforeUpdate } from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @CreateDateColumn({
    nullable: true,
  })
  created: string;

  @UpdateDateColumn({
    nullable: true,
  })
  updated: string;

  @BeforeInsert()
  insertCreated() {
    this.created = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    this.updated = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  }

  @BeforeUpdate()
  insertUpdated() {
    this.updated = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  }
}
