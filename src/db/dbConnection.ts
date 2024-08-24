import mongoose from "mongoose";
import dotenv from "dotenv";

class DBConnection {
    private static _instance: DBConnection;

    constructor() {
        dotenv.config();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public async connect() {
        try {
            await mongoose.connect(
                process.env.MDB_URI as string
            );
            console.log("Database connected");
        } catch (error) {
            console.error('Database connection failed', error);
        }
    }
}

export default DBConnection;