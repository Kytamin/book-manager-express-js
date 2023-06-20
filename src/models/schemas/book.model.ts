import { Schema, model } from "mongoose";

interface IBook {
    category: object;
    avatar: string;
    name: string;
    author: string;
    keywords: any;
    publisher: object
}

const keywordsSchema = new Schema({
    keyword: String
})

const bookSchema = new Schema<IBook>({
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    avatar: String,
    name: String,
    author: String,
    keywords: [keywordsSchema],
    publisher: { type: Schema.Types.ObjectId, ref: "Publisher" }
})

export const Book = model<IBook>('Book', bookSchema);