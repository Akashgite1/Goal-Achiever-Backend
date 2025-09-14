// generateSummary → create weekly/monthly summary (AI + DB aggregation)
// getAnalytics → return stats for visualization (charts)
// getActionItems → AI-generated next steps

// controllers/analytics.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Progress } from "../models/progress.model.js";
import { Goal } from "../models/goal.model.js";
import { Journey } from "../models/journey.model.js";
import { Chat } from "../models/chat.model.js";
import { Analytics } from "../models/analytics.model.js";
import { generateAIResponse, generatePracticeProblemsFromAI, summarizeChatSession } from "../utils/grokService.js"; // hypothetical AI helper


// Generate summary for a user
const generateSummary = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Fetch user data
    const progress = await Progress.find({ user: userId }).lean();
    const goals = await Goal.find({ owner: userId }).lean();
    const journeys = await Journey.find({ user: userId }).lean();
    const chat = await Chat.findOne({ user: userId }).lean();

    // Prepare input for AI
    const inputMessages = [
        {
            role: "system",
            content: "You are a helpful AI that generates concise learning summaries based on progress, goals, journeys, and chat messages."
        },
        {
            role: "user",
            content: `
            Goals: ${JSON.stringify(goals, null, 2)}
            Journeys: ${JSON.stringify(journeys, null, 2)}
            Progress: ${JSON.stringify(progress, null, 2)}
            Chat Messages: ${chat ? JSON.stringify(chat.messages, null, 2) : "No chat messages"}
            `
        }
    ];

    // Generate summary
    const aiSummary = await summarizeChatSession(inputMessages);
    // console.log("generated summary:", aiSummary);
    

    return res
        .status(201)
        .json(new apiResponse(201, { aiSummary }, "Summary generated successfully"));
});


// Fetch analytics/statistics for charts
const getAnalytics = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Get progress data
    const progressData = await Progress.find({ user: userId }).lean();

    // Optionally get Analytics stats
    const analyticsDoc = await Analytics.findOne({ user: userId }).lean();

    const analytics = progressData.map(p => ({
        journeyId: p.journey,
        completionRate: p.completionRate,
        lastUpdated: p.lastUpdated,
        velocity: analyticsDoc?.velocity || 0,
        progressPercent: analyticsDoc?.progress || 0
    }));

    // console.log("fetched analytics:", analytics);

    return res
        .status(200)
        .json(new apiResponse(200, analytics, "User analytics fetched"));
});

// Generate action items (AI-driven next steps)
const getActionItems = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Get user's progress
    const progress = await Progress.find({ user: userId }).lean();

    // Get user's chat messages
    const chat = await Chat.findOne({ user: userId }).lean();

    // Prepare messages for AI
    const inputMessages = [
        {
            role: "system",
            content: "You are a helpful assistant providing personalized next steps for learning progress."
        },
        {
            role: "user",
            content: `Here is the user's progress data:\n${JSON.stringify(progress, null, 2)}
            \nHere is the chat history:\n${chat ? JSON.stringify(chat.messages, null, 2) : "No chat messages"}`
        }
    ];

    // Call AI
    const actionItems = await generateAIResponse(inputMessages);
    // console.log("generated action items:", actionItems);

    return res
        .status(200)
        .json(new apiResponse(200, { actionItems }, "Action items generated successfully"));
});

export { generateSummary, getAnalytics, getActionItems };