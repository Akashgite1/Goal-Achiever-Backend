// 6. Progress

// Fields:
// user → reference to User
// journey → reference to Journey
// chunkCompleted → Number
// completionRate → Number (%)
// lastUpdated → Date

// src/models/progress.model.js

import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        journey: {
            type: Schema.Types.ObjectId,
            ref: "Journey",
            required: true,
        },
        chunkCompleted: {
            type: Number,
            default: 0,
        },
        completionRate: {
            type: Number,
            default: 0, // percentage
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt fields automatically
    }
);

export const Progress = mongoose.model("Progress", progressSchema);
