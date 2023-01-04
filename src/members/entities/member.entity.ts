import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


@Entity('ape_members')
export class Member {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    username: string;
}
