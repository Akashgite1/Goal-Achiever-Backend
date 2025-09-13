// scheduleCheckin → set daily/weekly/bi-weekly check-ins
// getCheckins → fetch upcoming & past check-ins
// submitCheckin → record answers/progress
// updateCheckin → reschedule/change frequency
// deleteCheckin → cancel


// src/controllers/checkin.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Checkin } from "../models/checkin.model.js";


// Schedule a new check-in
const scheduleCheckin = asyncHandler(async (req, res) => {
    const { goalId, frequency, startDate, time } = req.body;

    if (!goalId || !frequency || !startDate || !time) {
        throw new apiErrors(400, "All fields are required: goalId, frequency, startDate, time");
    }

    const checkin = await Checkin.create({
        user: req.user._id,
        goal: goalId,
        frequency, // daily, weekly, bi-weekly
        startDate,
        time,
        status: "pending" // default status
    });

    return res.status(201).json(new apiResponse(201, checkin, "Check-in scheduled successfully"));
});

// Fetch upcoming & past check-ins
const getCheckins = asyncHandler(async (req, res) => {
    const checkins = await Checkin.find({ user: req.user._id })
        .populate("goal", "title description status")
        .sort({ startDate: 1 });

    return res.status(200).json(new apiResponse(200, checkins, "Check-ins fetched successfully"));
});

// Submit or update check-in progress
const submitCheckin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { progress, notes } = req.body;

    const checkin = await Checkin.findOne({ _id: id, user: req.user._id });

    if (!checkin) throw new apiErrors(404, "Check-in not found");

    checkin.progress = progress || checkin.progress;
    checkin.notes = notes || checkin.notes;
    checkin.status = "completed"; // mark as completed
    checkin.updatedAt = new Date();

    await checkin.save();

    return res.status(200).json(new apiResponse(200, checkin, "Check-in submitted successfully"));
});

// Update/reschedule check-in
const updateCheckin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { frequency, startDate, time } = req.body;

    const checkin = await Checkin.findOne({ _id: id, user: req.user._id });

    if (!checkin) throw new apiErrors(404, "Check-in not found");

    if (frequency) checkin.frequency = frequency;
    if (startDate) checkin.startDate = startDate;
    if (time) checkin.time = time;

    await checkin.save();

    return res.status(200).json(new apiResponse(200, checkin, "Check-in updated successfully"));
});

// Cancel check-in
const deleteCheckin = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const checkin = await Checkin.findOneAndDelete({ _id: id, user: req.user._id });

    if (!checkin) throw new apiErrors(404, "Check-in not found or already deleted");

    return res.status(200).json(new apiResponse(200, null, "Check-in canceled successfully"));
});

export { scheduleCheckin, getCheckins, submitCheckin, updateCheckin, deleteCheckin };
