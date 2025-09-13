import mongoose, { Schema } from "mongoose";

const analyticsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
    },
    journey: {
      type: Schema.Types.ObjectId,
      ref: "Journey",
    },
    progress: {
      type: Number,
      default: 0, // percentage completion
    },
    velocity: {
      type: Number,
      default: 0, // learning speed or chunks/week
    },
    actionItems: {
      type: [String], // AI-generated next steps
      default: [],
    },
    summary: {
      type: String, // AI-generated weekly/monthly summary
      default: "",
    },
    stats: {
      type: Map, // key-value pairs for chart data
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Analytics = mongoose.model("Analytics", analyticsSchema);
