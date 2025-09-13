// 5. Chat / TutorSession

// Fields:
// user → reference to User
// journey → reference to Journey(optional)
// messages → Array { sender: String, message: String, timestamp: Date }
// createdAt → Date

import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: { type: String, enum: ["user", "ai"], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
         ref: "User", required: true 
        },
    journey: { 
        type: Schema.Types.ObjectId, 
        ref: "Journey", default: null 
    }, // optional
    messages: [messageSchema], // array of messages
}, 
{ 
    timestamps: true 
}
); // automatically adds createdAt & updatedAt

export const Chat = mongoose.model("Chat", chatSchema);
