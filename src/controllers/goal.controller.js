// createGoal → user defines high-level objective
// getGoals → list user’s goals
// getGoalById → fetch a specific goal with journeys & chunks
// updateGoal → edit title/description/status
// deleteGoal → remove goal & dependencies

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Goal } from "../models/goal.model.js";


// Create Goal
const createGoal = asyncHandler(async (req, res) => {
    const { title, description, deadline } = req.body;

    if (!title) {
        throw new apiErrors(400, "Goal title is required");
    }

    const goal = await Goal.create({
        title,
        description,
        deadline,
        owner: req.user._id,
    });
    console.log("goal created",goal);

    return res
        .status(201)
        .json(new apiResponse(201, goal, "Goal created successfully"));
});

// Get All Goals for Logged-in User
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ owner: req.user._id }).sort({ createdAt: -1 });
    const userId=req.user._id;
    console.log("goals fetched for user ",{},goals);
    return res.status(200).json(new apiResponse(200, goals, "Goals fetched successfully"));
});


// Get Goal by ID
const getGoalById = asyncHandler(async (req, res) => {
    const { goalId } = req.params;

    const goal = await Goal.findOne({ _id: goalId, owner: req.user._id });
    console.log("goal fetched",goal);
    if (!goal) {
        throw new apiErrors(404, "Goal not found");
    }

    return res.status(200).json(new apiResponse(200, goal, "Goal fetched successfully"));
});

// Update Goal
const updateGoal = asyncHandler(async (req, res) => {
    const { goalId } = req.params;
    const { title, description, status, deadline } = req.body;

    const goal = await Goal.findOneAndUpdate(
        { _id: goalId, owner: req.user._id },
        { title, description, status, deadline },
        { new: true, runValidators: true }
    );
    console.log("goal updated",goal);

    if (!goal) {
        throw new apiErrors(404, "Goal not found or update failed");
    }

    return res.status(200).json(new apiResponse(200, goal, "Goal updated successfully"));
});

// Delete Goal
const deleteGoal = asyncHandler(async (req, res) => {
    const { goalId } = req.params;

    const goal = await Goal.findOneAndDelete({ _id: goalId, owner: req.user._id });
    console.log("goal deleted",goal);

    if (!goal) {
        throw new apiErrors(404, "Goal not found or delete failed");
    }

    // TODO: Delete dependencies (progress, comments, etc.) if any

    return res.status(200).json(new apiResponse(200, null, "Goal deleted successfully"));
});

export { createGoal, getGoals, getGoalById, updateGoal, deleteGoal };

