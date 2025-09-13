// 1. Auth Routes

// /api/auth
// POST /register → registerUser
// GET /verify/:token → verifyEmail
// POST /login → loginUser
// POST /refresh → refreshToken
// POST /logout → logoutUser
// POST /forgot-password → forgotPassword
// POST /reset-password → resetPassword


import express from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


// define router instance provided by express 
const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);


export default router;
