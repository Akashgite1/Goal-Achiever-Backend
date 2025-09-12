// 1. User Model
// Fields:
// UserName → String
// email → String (unique, required)
// password → String (hashed)
// emailVerified → Boolean (default: false)
// createdAt → Date

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: null,
    }
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Check password correctness
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
};

export const User = mongoose.model("User", userSchema);
