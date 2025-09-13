// routes/progress.route.js
import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  updateProgress,
  getProgress,
  calculateVelocity,
  getCompletionRate,
} from "../controllers/progress.controller.js";
import {
  generateSummary,
  getAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// ✅ Protect all progress routes
router.use(verifyJWT);

// 🚀 Progress Routes
router.post("/update", updateProgress);               // Log/update chunk completion
router.get("/:userId", getProgress);                  // Get progress for a specific user
router.get("/:userId/velocity", calculateVelocity);   // Calculate learning speed
router.get("/:userId/completion", getCompletionRate); // Completion percentage

// 📊 Analytics Routes (linked to progress)
router.get("/:userId/summary", generateSummary);      // Weekly/monthly summary
router.get("/:userId/stats", getAnalytics);           // Detailed analytics for charts

export default router;
