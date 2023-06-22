import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    password: string;
    role: string
    google: {
        id: {
            type: string,
        },
    }
}

const userSchema = new Schema<IUser> ({
    google: {
        id: {
            type: String
        }
    },
    username: String,
    password: String,
    role: String
})

export const User = model<IUser>('User', userSchema,'User');