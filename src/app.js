import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/user.route.js';


// creating the express app or the variable
const app = express();

// use is the middleware provided by the express get the data from the body of the request
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


// get the data from the frontend 
// wen can also set the limit for the data 
app.use(express.json({ limit: '16kb' }));
// get the data from url 
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// importing all the routes
import userRoutes from './routes/user.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import chatRoutes from './routes/chat.route.js'
import checkInRoutes from './routes/check-in.route.js'
import goalRoutes from './routes/goal.route.js';
import journeyRoute from './routes/journy.route.js';
import progressRoutes from './routes/progress.route.js';


// all Rotutes
app.use("/api/users", userRoutes);  // all user routes prefixed with /api/users
app.use("/api/analytics", analyticsRoutes); // all analytics routes prefixed with /api/analytics
app.use("/api/tutor", chatRoutes); // all chat routes prefixed with /api/tutor
app.use("/api/checkins", checkInRoutes); // all check-in routes prefixed with /api/checkins
app.use("/api/goals", goalRoutes); // all goal routes prefixed with /api/goals
app.use("/api/journeys", journeyRoute); // all journey routes prefixed with /api/journeys
app.use("/api/progress", progressRoutes); // all progress routes prefixed with /api/progress
app.use("/api/auth", authRoutes); // all auth routes prefixed with /api/auth

export { app };

