import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  generateSummary,
  getAnalytics,
  getActionItems,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// ✅ Protect all analytics routes
router.use(verifyJWT);

// 📊 Analytics routes
router.get("/:userId/summary", generateSummary);      // Weekly/monthly summary
router.get("/:userId/stats", getAnalytics);           // Stats for charts
router.get("/:userId/action-items", getActionItems);  // AI-generated next steps

export default router;
