import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MembersRepository } from './repositories/members.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([ 
      Member 
    ]),
  ],
  controllers: [MembersController],
  providers: [
    MembersService,
    MembersRepository
  ]
})
export class MembersModule {}
