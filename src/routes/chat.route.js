// 5. Tutor / Chat Routes

// /api/tutor
// POST /start-session → startSession
// POST /send-message → sendMessage
// GET /history/:sessionId → getSessionHistory


import express from "express";
import { startSession, sendMessage, getSessionHistory } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes – user must be authenticated
router.use(verifyJWT);

// Start a new tutor session
router.post("/start-session", startSession);

// Send message to AI / tutor
router.post("/send-message", sendMessage);

// Fetch past chat history by sessionId
router.get("/history/:sessionId", getSessionHistory);

export default router;
