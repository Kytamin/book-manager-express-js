import mongoose from "mongoose";

export class DataBase {
    static async connectDB() {
        const DB_URl = 'mongodb://127.0.0.1:27017/booksmanager';
        return await mongoose.connect(DB_URl);
    }
}