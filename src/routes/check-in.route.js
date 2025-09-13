// 4. Check-in Routes
// /api/checkins
// POST / → scheduleCheckin
// GET / → getCheckins
// PUT /:id → submit/update checkin
// DELETE /:id → cancel checkin

// src/routes/checkin.route.js

import express from "express";
import {
  scheduleCheckin,
  getCheckins,
  submitCheckin,
  updateCheckin,
  deleteCheckin,
} from "../controllers/checkin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Apply JWT middleware to all routes
router.use(verifyJWT);

// 📌 Check-in routes
router
  .route("/")
  .post(scheduleCheckin) // Create / schedule a new check-in
  .get(getCheckins);     // Get all check-ins (upcoming & past)

router
  .route("/:id")
  .put(updateCheckin)    // Update a check-in
  .delete(deleteCheckin); // Delete a check-in

// 📌 Special action: Submit a check-in
router.put("/:id/submit", submitCheckin);

export default router;
