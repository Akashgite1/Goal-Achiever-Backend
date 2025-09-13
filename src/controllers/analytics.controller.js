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
import { generateAIResponse, generatePracticeProblemsFromAI, summarizeChatSession } from "../utils/grokService.js"; // hypothetical AI helper



// Generate summary for a user
const generateSummary = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Aggregate data
    const progress = await Progress.find({ user: userId });
    const goals = await Goal.find({ user: userId });
    const journeys = await Journey.find({ user: userId });

    // Convert objects into plain text summary input
    const inputMessages = [
        {
            role: "user",
            content: `Generate a learning summary for the following data:
            Goals: ${JSON.stringify(goals)}
            Journeys: ${JSON.stringify(journeys)}
            Progress: ${JSON.stringify(progress)}`
        }
    ];

    // Use AI helper (summarizeChatSession)
    const aiSummary = await summarizeChatSession(inputMessages);
    console.log("AI Summary:", aiSummary);

    return res
        .status(200)
        .json(new apiResponse(200, { aiSummary }, "User summary generated"));
});


// Fetch analytics/statistics for charts
const getAnalytics = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Example: calculate completion % per journey
    const progressData = await Progress.find({ user: userId });
    const analytics = progressData.map(p => ({
        journeyId: p.journey,
        completionRate: p.completionRate,
        lastUpdated: p.lastUpdated
    }));

    return res
        .status(200)
        .json(new apiResponse(200, analytics, "User analytics fetched"));
});

// Generate action items (AI-driven next steps)
const getActionItems = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Collect relevant progress data
    const progress = await Progress.find({ user: userId });

    // Build input for AI
    const inputMessages = [
        {
            role: "user",
            content: `Based on this progress data, suggest personalized next steps:
            ${JSON.stringify(progress)}`
        }
    ];

    // Use AI helper (generateAIResponse)
    const actionItems = await generateAIResponse(inputMessages);

    return res
        .status(200)
        .json(new apiResponse(200, { actionItems }, "Next action items generated"));
});

export { generateSummary, getAnalytics, getActionItems };