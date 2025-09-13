// updateProgress → log completion of chunk/milestone
// getProgress → fetch progress by goal/journey
// calculateVelocity → compute learning speed
// getCompletionRate → completion % by module/journey

// src/controllers/progress.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/APIErros.js";
import { ApiResponse } from "../utils/APiResponce.js";
import { Progress } from "../models/progress.model.js"; // assuming you have Progress model

// Log/update progress for a chunk or milestone
const updateProgress = asyncHandler(async (req, res) => {
    const { userId, goalId, journeyId, chunkId, completed } = req.body;

    if (!userId || !goalId || !journeyId || !chunkId) {
        throw new ApiErrors(400, "All required fields must be provided");
    }

    // update existing or create new progress document
    const progress = await Progress.findOneAndUpdate(
        { user: userId, goal: goalId, journey: journeyId, chunk: chunkId },
        { completed, updatedAt: Date.now() },
        { new: true, upsert: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, progress, "Progress updated successfully"));
});

// Fetch progress by goal or journey
const getProgress = asyncHandler(async (req, res) => {
    const { userId, goalId, journeyId } = req.query;

    const filter = { user: userId };
    if (goalId) filter.goal = goalId;
    if (journeyId) filter.journey = journeyId;

    const progressList = await Progress.find(filter);

    return res
        .status(200)
        .json(new ApiResponse(200, progressList, "Progress fetched successfully"));
});

// Calculate learning velocity (chunks/milestones per day)
const calculateVelocity = asyncHandler(async (req, res) => {
    const { userId, goalId } = req.query;

    if (!userId || !goalId) {
        throw new ApiErrors(400, "userId and goalId are required");
    }

    const progressList = await Progress.find({ user: userId, goal: goalId, completed: true });
    
    const startDate = progressList.length
        ? new Date(progressList[0].createdAt)
        : new Date();
    const days = (Date.now() - startDate) / (1000 * 60 * 60 * 24) || 1;

    const velocity = progressList.length / days;

    return res.status(200).json(
        new ApiResponse(200, { velocity }, "Learning velocity calculated successfully")
    );
});

// Get completion rate by module/journey
const getCompletionRate = asyncHandler(async (req, res) => {
    const { userId, journeyId } = req.query;

    if (!userId || !journeyId) {
        throw new ApiErrors(400, "userId and journeyId are required");
    }

    const totalChunks = await Progress.countDocuments({ user: userId, journey: journeyId });
    const completedChunks = await Progress.countDocuments({
        user: userId,
        journey: journeyId,
        completed: true,
    });

    const completionRate = totalChunks ? (completedChunks / totalChunks) * 100 : 0;

    return res.status(200).json(
        new ApiResponse(200, { completionRate }, "Completion rate fetched successfully")
    );
});

export { updateProgress, getProgress, calculateVelocity, getCompletionRate };
