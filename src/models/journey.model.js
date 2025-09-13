// 3. Journey

// Fields:
// goal → reference to Goal
// timelineWeeks → Number
// milestones → Array of objects { week: Number, objectives: [String], dependencies: [String] }
// createdAt → Date


// models/journey.model.js
import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: true,
    },
    objectives: {
        type: [String],
        default: [],
    },
    dependencies: {
        type: [String],
        default: [],
    },
});

const journeySchema = new mongoose.Schema(
    {
        goal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Goal",
            required: true,
        },
        timelineWeeks: {
            type: Number,
            required: true,
        },
        milestones: [milestoneSchema],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt
    }
);

export const Journey = mongoose.model("Journey", journeySchema);
