import { Schema, model } from "mongoose";

const publisherSchema = new Schema({
    name: String
})

export const Publisher = model('Publisher', publisherSchema);