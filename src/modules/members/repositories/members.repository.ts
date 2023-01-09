import { Repository } from 'typeorm';
import { Member } from "../entities/member.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
export class MembersRepository extends Repository<Member> {
    // Custom repository methods go here
}
