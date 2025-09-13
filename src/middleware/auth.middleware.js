// Verify JWT tokens
// Attach req.user for protected routes

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiErrors.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            return next(new ApiErrors("You are not authenticated", 401));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            // 
            return next(new ApiErrors("Invalid Access Token", 404));
        }

        req.user = user; // attach the user to the request object
        next(); // call the next middleware or route handler
    } catch (error) {
        console.error("JWT verification error:", error);
        return next(new ApiErrors("Invalid Access Token", 401));
    }

})