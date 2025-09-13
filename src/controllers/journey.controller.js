// suggestJourney → call AI service to auto-generate 6-week to 6-month timeline
// customizeJourney → user adjusts journey manually
// getJourney → fetch journey + milestones
// updateJourney → edit timeline/milestones


// controllers/journey.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/APIErros.js";
import { ApiResponse } from "../utils/APiResponce.js";
import { Journey } from "../models/journey.model.js";
import { Goal } from "../models/goal.model.js";

// Suggest AI-generated journey (6-week to 6-month)
const suggestJourney = asyncHandler(async (req, res) => {
    const { goalId } = req.body;

    if (!goalId) throw new ApiErrors(400, "Goal ID is required");

    // call AI service to generate milestones and timeline
    // e.g., using Grok or other LLM
    const aiGeneratedJourney = await generateJourneyAI(goalId); // your AI integration

    const journey = await Journey.create({
        goal: goalId,
        milestones: aiGeneratedJourney.milestones,
        duration: aiGeneratedJourney.duration,
        user: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, journey, "Journey suggested successfully"));
});

// Customize journey manually
const customizeJourney = asyncHandler(async (req, res) => {
    const { journeyId, milestones } = req.body;

    const journey = await Journey.findByIdAndUpdate(
        journeyId,
        { milestones },
        { new: true }
    );

    if (!journey) throw new ApiErrors(404, "Journey not found");

    return res.status(200).json(new ApiResponse(200, journey, "Journey updated successfully"));
});

// Get journey by goal
const getJourney = asyncHandler(async (req, res) => {
    const { goalId } = req.params;

    const journey = await Journey.findOne({ goal: goalId }).populate("milestones");

    if (!journey) throw new ApiErrors(404, "Journey not found");

    return res.status(200).json(new ApiResponse(200, journey, "Journey fetched successfully"));
});

// Update journey timeline or milestones
const updateJourney = asyncHandler(async (req, res) => {
    const { journeyId, updates } = req.body;

    const journey = await Journey.findByIdAndUpdate(journeyId, updates, { new: true });

    if (!journey) throw new ApiErrors(404, "Journey not found");

    return res.status(200).json(new ApiResponse(200, journey, "Journey updated successfully"));
});



export { 
    suggestJourney, 
    customizeJourney, 
    getJourney, 
    updateJourney 
};
