import mongoose from "mongoose";

import db from "../connections/dbConnection.js";

const Schema = mongoose.Schema;

//Creating User Schema
const noticeSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please enter notice title!"],
        },
        refId: {
            type: String,
            required: [true, "Please enter notice reference Id!"],
        },
        description: {
            type: String,
        },
        imageUrl: {
            type: String,
            required: [true, "Please provide image!"],
        },
    },
    { timestamps: true }
);

//Create Model out of Schema

const Notice = db.model("Notice", noticeSchema);

export default Notice;
