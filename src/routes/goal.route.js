import express from "express";
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} from "../controllers/goal.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Protect all goal routes
router.use(verifyJWT);

// 🎯 Goal Routes
router
  .route("/")          // /api/goals
  .post(createGoal)    // Create a new goal
  .get(getGoals);      // Get all goals for the logged-in user

router
  .route("/:goalId")   // /api/goals/:goalId
  .get(getGoalById)    // Get a goal by ID
  .put(updateGoal)     // Update a goal
  .delete(deleteGoal); // Delete a goal

export default router;
