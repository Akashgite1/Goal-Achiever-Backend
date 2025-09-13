// generateSummary → create weekly/monthly summary (AI + DB aggregation)
// getAnalytics → return stats for visualization (charts)
// getActionItems → AI-generated next steps

// controllers/analytics.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/APIErros.js";
import { ApiResponse } from "../utils/APiResponce.js";
import { Progress } from "../models/progress.model.js";
import { Goal } from "../models/goal.model.js";
import { Journey } from "../models/journey.model.js";
import { TutorSession } from "../models/chat.model.js";
import { callAIService } from "../services/aiService.js"; // hypothetical AI helper

// Generate summary for a user
const generateSummary = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Aggregate progress, journeys, and goals
    const progress = await Progress.find({ user: userId });
    const goals = await Goal.find({ user: userId });
    const journeys = await Journey.find({ user: userId });

    // Call AI to generate textual summary
    const aiSummary = await callAIService({
        type: "summary",
        data: { progress, goals, journeys }
    });

    return res.status(200).json(new ApiResponse(200, { aiSummary }, "User summary generated"));
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

    return res.status(200).json(new ApiResponse(200, analytics, "User analytics fetched"));
});

// Generate action items (AI-driven next steps)
const getActionItems = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Collect relevant progress data
    const progress = await Progress.find({ user: userId });

    // AI generates recommendations
    const actionItems = await callAIService({
        type: "actionItems",
        data: progress
    });

    return res.status(200).json(new ApiResponse(200, { actionItems }, "Next action items generated"));
});

export { generateSummary, getAnalytics, getActionItems };


