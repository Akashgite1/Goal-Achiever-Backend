// User Controller
// registerUser → validate input, hash password, create user, send verification email
// verifyEmail → confirm verification token, activate account
// loginUser → check credentials, issue JWT (access & refresh tokens)
// refreshToken → reissue access token using refresh token
// logoutUser → invalidate refresh token / clear cookie
// forgotPassword → send reset link
// resetPassword → update password securely


import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiErrors } from '../utils/APIErros.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/APiResponce.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


// creating methods for genarating access token and refresh token 
const generateAccessAndRefreshTokens = async (userId) => {
    // this function will generate access token and refresh token for the user
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiErrors(404, "User not found");
        }
        // generate access token
        const accessToken = user.generateAccessToken();
        // generate refresh token
        const refreshToken = user.generateRefreshToken();

        // save the refresh token in the user document add in database 
        // so we dont have to generate new refresh token every time user logs in
        user.refreshToken = refreshToken;
        // save the user document with the new refresh token
        // this will update the user document with the new refresh token
        await user.save({ validateBeforeSave: false });

        // return the tokens
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiErrors(500, "Error generating tokens");
    }
}

// register User
const registerUser = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;
    console.log("Register attempt:", { email, userName });

    if (!userName || !email || !password) {
        throw new ApiErrors(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { userName }]
    });

    if (existingUser) {
        throw new ApiErrors(400, "User already exists with this Username or Email");
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        password, // will be hashed by schema pre-save hook
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiErrors(500, "User creation failed");
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res.status(201).json(
        new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User registered successfully")
    );
});


// login User
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log("Login attempt:", { email });

    if (!email || !password) {
        throw new ApiErrors(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiErrors(400, "User not found with this Email");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiErrors(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});


// logout User
const logoutUser = asyncHandler(async (req, res) => {
    // remove refresh token from DB
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    // cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});



// refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiErrors(401, "Unauthorized request, no refresh token");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiErrors(404, "User not found");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiErrors(401, "Refresh token is expired or invalid");
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid refresh token");
    }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };