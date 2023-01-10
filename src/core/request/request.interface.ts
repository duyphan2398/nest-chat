import { Request } from 'express';
import {Member} from "../../modules/members/entities/member.entity";

export interface RequestInterface extends Request {
    authMember: Member;
}
