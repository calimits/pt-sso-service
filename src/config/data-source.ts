import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "../features/auth/entities/User";
import Token from "../features/auth/entities/Token";


const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [Token, User],
    migrations: ["src/migrations/*.ts"],
    synchronize: true,
    logging: false,
})

export default AppDataSource;
