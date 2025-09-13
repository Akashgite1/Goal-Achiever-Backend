// 6. Progress / Analytics Routes

// /api/progress
// POST /update → updateProgress
// GET /:userId → getProgress
// /api/analytics
// GET /summary/:userId → generateSummary
// GET /stats/:userId → getAnalytics

// src/routes/progress.route.js

import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    updateProgress,
    getProgress,
    generateSummary,
    getAnalytics
} from "../controllers/progress.controller.js";

const router = express.Router();

// Progress routes
router.post("/update", verifyJWT, updateProgress); // log/update chunk completion
router.get("/:userId", verifyJWT, getProgress);   // get progress for a specific user

// Analytics routes
router.get("/summary/:userId", verifyJWT, generateSummary); // summary of user's progress
router.get("/stats/:userId", verifyJWT, getAnalytics);      // detailed analytics

export default router;
