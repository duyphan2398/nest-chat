import { Request } from 'express';
import { Member } from '../../modules/chats/entities/member.entity';

export interface RequestInterface extends Request {
  authMember: Member | null;
}
