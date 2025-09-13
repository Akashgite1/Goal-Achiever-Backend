// chat.controller.js
// startSession → initialize tutor session (chat context, socket setup)
// sendMessage → user sends message → AI responds (LLM call)
// getSessionHistory → fetch past tutor chat logs
// generatePracticeProblems → AI generates practice sets
// summarizeSession → AI creates session summary


import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/APIErros.js";
import { generateAIResponse, generatePracticeProblemsFromAI, summarizeChatSession } from "../services/grokService.js";


// Start a new session
const startSession = asyncHandler(async (req, res) => {
    const chat = await Chat.create({
        user: req.user._id,
        sessionId: `session_${Date.now()}`,
        messages: []
    });

    res.status(201).json({ status: "success", session: chat });
});

// Send a message and get AI response
const sendMessage = asyncHandler(async (req, res) => {
    const { sessionId, message } = req.body;

    if (!message || !sessionId) throw new ApiErrors(400, "Session ID and message are required");

    const chat = await Chat.findOne({ sessionId, user: req.user._id });
    if (!chat) throw new ApiErrors(404, "Session not found");

    // Add user message
    chat.messages.push({ sender: "user", content: message });

    // Call Grok AI
    const aiResponse = await generateAIResponse(chat.messages);

    chat.messages.push({ sender: "ai", content: aiResponse });
    await chat.save();

    res.status(200).json({ status: "success", aiResponse });
});

// Get session history
const getSessionHistory = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({ sessionId, user: req.user._id });
    if (!chat) throw new ApiErrors(404, "Session not found");

    res.status(200).json({ status: "success", messages: chat.messages });
});

// Generate practice problems using AI
const generatePracticeProblems = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    const chat = await Chat.findOne({ sessionId, user: req.user._id });
    if (!chat) throw new ApiErrors(404, "Session not found");

    const practiceProblems = await generatePracticeProblemsFromAI(chat.messages);
    res.status(200).json({ status: "success", practiceProblems });
});

// Summarize session
const summarizeSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    const chat = await Chat.findOne({ sessionId, user: req.user._id });
    if (!chat) throw new ApiErrors(404, "Session not found");

    const summary = await summarizeChatSession(chat.messages);
    chat.summary = summary;
    await chat.save();

    res.status(200).json({ status: "success", summary });
});

export { startSession, sendMessage, getSessionHistory, generatePracticeProblems, summarizeSession };
