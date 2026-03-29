import { Entity, Column, PrimaryColumn } from "typeorm";
import User from "./User";

@Entity()
export class Token {
    @PrimaryColumn({ unique: true, nullable: false })
    uuid!: string;
    
    @Column({ length: 40, nullable: false })
    type!: "access" | "refresh";

    @Column({ unique: true, nullable: false })
    token!: string;

    @Column({ nullable: false })
    userId!: number
}

export default Token;

