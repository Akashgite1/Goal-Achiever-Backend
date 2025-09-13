import express from "express";
import {
  startSession,
  sendMessage,
  getSessionHistory,
  generatePracticeProblems,
  summarizeSession,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Protect all chat/tutor session routes
router.use(verifyJWT);

// 🎯 Tutor Session Routes
router.post("/sessions", startSession);                       // Start a new tutor session
router.post("/sessions/:sessionId/messages", sendMessage);     // Send a message in a session
router.get("/sessions/:sessionId/history", getSessionHistory); // Get chat history
router.post("/sessions/:sessionId/practice", generatePracticeProblems); // Generate practice problems
router.post("/sessions/:sessionId/summary", summarizeSession); // Summarize a chat session

export default router;
