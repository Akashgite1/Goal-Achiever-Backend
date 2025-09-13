// 2. Goal Routes

// /api/goals
// POST / → createGoal
// GET / → getGoals
// GET /:id → getGoalById
// PUT /:id → updateGoal
// DELETE /:id → deleteGoal

import express from "express";
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal
} from "../controllers/goal.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

// Create router instance
const router = express.Router();

// Apply middleware to all routes
router.use(verifyJWT);

// Goal Routes
router.post("/", createGoal);           // Create a new goal
router.get("/", getGoals);             // Get all goals for logged-in user
router.get("/:goalId", getGoalById);  // Get a specific goal by ID
router.put("/:goalId", updateGoal);   // Update a goal
router.delete("/:goalId", deleteGoal);// Delete a goal

export default router;
