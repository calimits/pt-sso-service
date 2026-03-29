import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import Token from "./Token";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false })
    email!: string;

    @Column({ nullable: false })
    password!: string;
}

export default User;
