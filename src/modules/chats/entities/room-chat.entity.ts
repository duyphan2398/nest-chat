import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
    CreateDateColumn
} from "typeorm";
import {Member} from "./member.entity";
import {Expert} from "./expert.entity";

@Entity('ape_room_chats')
export class RoomChat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    member_id: string;

    @Column()
    expert_id: string;

    @Column()
    status: string;

    @CreateDateColumn()
    created: string;

    @UpdateDateColumn()
    updated: string;

    // --- RELATIONS
    // Member
    @ManyToOne(type => Member, member => member.room_chats)
    @JoinColumn({ name: "member_id" })
    member: Member;

    // Expert
    @ManyToOne(type => Expert, expert => expert.room_chats)
    @JoinColumn({ name: "expert_id" })
    expert: Member;
}
