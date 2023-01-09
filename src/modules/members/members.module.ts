import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import {MomentProvider} from "../../providers/moment.provider";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member
    ]),
  ],
  controllers: [MembersController],
  providers: [
    MembersService,
  ],
  exports: [
    MembersService,
  ]
})
export class MembersModule {}
