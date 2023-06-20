import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: String
})

export const Category = model('Category', categorySchema);