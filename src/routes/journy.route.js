// routes/journey.route.js
import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  suggestJourney,
  customizeJourney,
  getJourney,
  updateJourney,
} from "../controllers/journey.controller.js";

const router = express.Router();

// ✅ Protect all journey routes
router.use(verifyJWT);

// ✨ Journey Routes
router.post("/suggest", suggestJourney);   // AI-generated journey suggestion
router.post("/customize", customizeJourney); // Manually customize a journey

router
  .route("/:journeyId")  // /api/journeys/:journeyId
  .get(getJourney)       // Fetch journey by ID
  .put(updateJourney);   // Update milestones/timeline

export default router;
