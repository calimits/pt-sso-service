import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "../features/auth/entities/User";
import Token from "../features/auth/entities/Token";


const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Token, User],
    migrations: ["src/migrations/*.ts"],
    synchronize: true,
    logging: false,
})

export default AppDataSource;
