import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


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
}
