import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  generateSummary,
  getAnalytics,
  getActionItems
} from "../controllers/analytics.controller.js";

const router = express.Router();

// All routes protected with JWT
router.get("/summary/:userId", verifyJWT, generateSummary); // weekly/monthly summary
router.get("/stats/:userId", verifyJWT, getAnalytics); // stats for charts
router.get("/action-items/:userId", verifyJWT, getActionItems); // next steps

export default router;
