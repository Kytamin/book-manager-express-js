import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    password: string;
    role: string
}

const userSchema = new Schema<IUser> ({
    username: String,
    password: String,
    role: String
})

export const User = model<IUser>('User', userSchema);