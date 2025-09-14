// chat.controller.js
// startSession → initialize tutor session (chat context, socket setup)
// sendMessage → user sends message → AI responds (LLM call)
// getSessionHistory → fetch past tutor chat logs
// generatePracticeProblems → AI generates practice sets
// summarizeSession → AI creates session summary


import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors} from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { generateAIResponse, generatePracticeProblemsFromAI, summarizeChatSession } from "../utils/grokService.js";


// Start a new session
const startSession = asyncHandler(async (req, res) => {
    const chat = await Chat.create({
        user: req.user._id,
        sessionId: `session_${Date.now()}`,
        messages: []
    });
    
    console.log("New session started:", chat.sessionId);

    return res.status(201).json(new apiResponse(201, { session: chat }, "Session created successfully"));
});



// Send a message and get AI response
const sendMessage = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;      // sessionId comes from URL
    const { message } = req.body;          // message comes from body

    if (!message) throw new apiErrors(400, "Message is required");

    // Find the chat session by sessionId and logged-in user
    const chat = await Chat.findOne({ _id: sessionId, user: req.user._id });
    if (!chat) throw new apiErrors(404, "Session not found");
    
    console.log("Session found, sending message to AI:");

    // Add user's message to chat
    chat.messages.push({ sender: "user", message });
    console.log("User message added:", message);

    // Call AI helper
    const aiResponse = await generateAIResponse(chat.messages);
    console.log("AI response received:", aiResponse);

    // Save AI response
    chat.messages.push({ sender: "ai", message: aiResponse });
    // save the chat in the database
    await chat.save();

    return res.status(200).json(
        new apiResponse(200, { aiResponse }, "AI response generated successfully")
    );
});



// Get session history
const getSessionHistory = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({ sessionId, user: req.user._id });
    if (!chat) throw new apiErrors(404, "Session not found");
    
    // console.log("Session history called")
    console.log("session history called")
    console.log("session history fetched",chat.messages)

    return res.status(200).json(new apiResponse(200, { messages: chat.messages }, "Session history retrieved"));
});

// Generate practice problems using AI
const generatePracticeProblems = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    const chat = await Chat.findOne({ sessionId, user: req.user._id });
    if (!chat) throw new apiErrors(404, "Session not found");
    

    const practiceProblems = await generatePracticeProblemsFromAI(chat.messages);
    return res.status(200).json(new apiResponse(200, { practiceProblems }, "Practice problems generated"));
});

// Summarize session
const summarizeSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    const chat = await Chat.findOne({ sessionId, user: req.user._id });
    if (!chat) throw new apiErrors(404, "Session not found");

    const summary = await summarizeChatSession(chat.messages);
    chat.summary = summary;
    await chat.save();

    return res.status(200).json(new apiResponse(200, { summary }, "Session summary generated"));
});

export { startSession, sendMessage, getSessionHistory, generatePracticeProblems, summarizeSession };
