// 2. Goal

// Fields:
// user → reference to User
// title → String
// description → String
// complexity → Enum / String
// createdAt → Date

import mongoose, { Schema } from "mongoose";

const goalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model("Goal", goalSchema);

