import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";
import {Expert} from "./expert.entity";

@Entity('ape_members')
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone_number: string;

    @Column()
    social_facebook_id: string;

    @Column()
    username: string;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    country_code: string;

    @Column()
    gender: number;

    @Column()
    birthday: string;

    @Column()
    avatar: string;


    @Column()
    token: string;

    @Column()
    created_token: string;

    @Column()
    is_verify: string;

    @Column()
    status: string;

    // --- RELATIONS
    // Expert
    @OneToMany(type => Expert, expert => expert.member)
    @JoinColumn({ name: "expert_id" })
    experts: Expert[];
}
