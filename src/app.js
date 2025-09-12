import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


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

export { app };
