// 3. Journey Routes

// /api/journeys
// POST /suggest → suggestJourney
// GET /:id → getJourney
// PUT /:id → updateJourney


// routes/journey.route.js
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { suggestJourney, getJourney, updateJourney } from "../controllers/journey.controller.js";

const router = express.Router();

// Protected routes
router.post("/suggest", verifyJWT, suggestJourney); // AI-generated journey suggestion
router.get("/:id", verifyJWT, getJourney);          // Fetch journey by ID
router.put("/:id", verifyJWT, updateJourney);       // Update milestones/timeline

export default router;

