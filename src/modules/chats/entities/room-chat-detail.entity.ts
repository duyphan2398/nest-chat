import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import {Member} from "./member.entity";

@Entity('ape_experts')
export class Expert {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_chat_id: number;

    @Column()
    sender_id: number;

    @Column()
    sender_type: string;

    @Column()
    sender_status: number;

    @Column()
    receiver_id: number;

    @Column()
    receiver_type: string;

    @Column()
    receiver_status: number;

    @Column()
    chat_time: string;

    @Column()
    content: string;

    @Column()
    type: string;

    @Column()
    token: string;

    @Column()
    created_token: string;

    // --- RELATIONS
    // Expert
    @ManyToOne(type => Expert, expert => expert.room_chats)
    @JoinColumn({ name: "expert_id" })
    expert: Member;
}
