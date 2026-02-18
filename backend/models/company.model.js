import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }, // <--- New
    website: { type: String }, // <--- New
    location: { type: String }, // <--- New
    logo: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);