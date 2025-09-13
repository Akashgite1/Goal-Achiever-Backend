// 4. Checkin

// Fields:
// user → reference to User
// journey → reference to Journey
// scheduledAt → Date
// answers → Array or JSON
// status → Enum (pending, completed)

// src/models/checkin.model.js

import mongoose, { Schema } from "mongoose";

const checkinSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        journey: {
            type: Schema.Types.ObjectId,
            ref: "Journey", // assuming you have a Journey model
            required: true,
        },
        scheduledAt: {
            type: Date,
            required: true,
        },
        answers: {
            type: Array, // can store array of answers or JSON objects
            default: [],
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export const Checkin = mongoose.model("Checkin", checkinSchema);

