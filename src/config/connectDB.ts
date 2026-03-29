import AppDataSource from "./data-source";


async function connectDB() {
    await AppDataSource.initialize();
    console.log("DB connected");
}

export default connectDB;