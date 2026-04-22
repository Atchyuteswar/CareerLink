import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true
    },
    pros: { type: String },
    cons: { type: String },
    reviewType: {
        type: String,
        enum: ['employee', 'interview', 'intern'],
        default: 'employee'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    ratings: {
        culture: { type: Number, min: 1, max: 5, default: 3 },
        workLifeBalance: { type: Number, min: 1, max: 5, default: 3 },
        salary: { type: Number, min: 1, max: 5, default: 3 },
        growth: { type: Number, min: 1, max: 5, default: 3 },
    },
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);
