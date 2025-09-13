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
  submitOrUpdateCheckin,
  cancelCheckin
} from "../controllers/checkin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all routes with JWT middleware
router.use(verifyJWT);

// Schedule a new check-in
router.post("/", scheduleCheckin);

// Fetch all check-ins (upcoming & past)
router.get("/", getCheckins);

// Submit or update a check-in
router.put("/:id", submitOrUpdateCheckin);

// Cancel a check-in
router.delete("/:id", cancelCheckin);

export default router;
