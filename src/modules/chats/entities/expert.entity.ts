import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import {Member} from "./member.entity";

@Entity('ape_experts')
export class Expert {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    job_title: string;

    @Column()
    expert_avatar: string;

    @Column()
    member_id: number;

    @Column()
    is_admin: number;

    @Column()
    status: string;

    @Column()
    token: string;

    @Column()
    created_token: string;

    // --- RELATIONS
    // Member
    @ManyToOne(type => Member, member => member.experts)
    @JoinColumn({ name: "member_id" })
    member: Member;
}
