import { Request } from 'express';
import {Member} from "../../modules/chats/entities/member.entity";
import {Expert} from "../../modules/chats/entities/expert.entity";
export interface RequestInterface extends Request {
    authMember: Member | null;
    authExpert: Expert | null;
}
