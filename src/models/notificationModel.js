import mongoose from "mongoose";

import db from "../connections/dbConnection.js";

const Schema = mongoose.Schema;

//Creating User Schema
const notificationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

//Create Model out of Schema

const Notification = db.model("Notification", notificationSchema);

export default Notification;
