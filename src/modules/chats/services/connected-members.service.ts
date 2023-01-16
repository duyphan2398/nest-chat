import {Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {I18nService} from "nestjs-i18n";
import {ConnectedMember} from "../entities/connected-member.entity";
import {RoomChat} from "../entities/room-chat.entity";

@Injectable()
export class ConnectedMembersService {
  constructor(
    @InjectRepository(ConnectedMember) private connectedMemberRepo: Repository<ConnectedMember>,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

  async save(data: object): Promise<ConnectedMember> {
    const connectedMember = this.connectedMemberRepo.create(data);
    return await this.connectedMemberRepo.save(connectedMember);
  }

  async deleteByConnectedId(connectedId: string)  {
    return await this.connectedMemberRepo.delete({'connected_id': connectedId});
  }
}
