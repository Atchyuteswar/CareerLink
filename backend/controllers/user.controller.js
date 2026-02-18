import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { extractDataFromResume } from "../utils/resumeParser.js";

// 1. REGISTER LOGIC
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Basic Validation
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        // Check if email already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            })
        }

        // Hash the password (Security)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// 2. LOGIN LOGIC
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        // Find user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }

        // Check Password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };

        // Check Role
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        // Generate Token
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Clean up user data for sending to frontend
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        // Send Cookie
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// 3. LOGOUT LOGIC
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// 4. UPDATE PROFILE LOGIC
export const updateProfile = async (req, res) => {
    try {
        // --- FIXED: Added all fields to destructuring ---
        const { fullname, email, phoneNumber, bio, skills, headline, github, linkedin, portfolio } = req.body;

        // --- FIXED: Defined 'file' variable ---
        const file = req.file;

        const userId = req.id; // From middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }

        // Update fields if they exist in request
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (headline) user.profile.headline = headline;
        if (github) user.profile.github = github;
        if (linkedin) user.profile.linkedin = linkedin;
        if (portfolio) user.profile.portfolio = portfolio;
        if (skills && typeof skills === 'string') {
            user.profile.skills = skills.split(",");
        }

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { 
                resource_type: 'raw',
                format: 'pdf' 
            });

            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;

            // --- DEBUGGING LOGS ---
            console.log("--- Resume Parsing Debug ---");
            console.log("Original Name:", file.originalname);
            console.log("Cloudinary URL:", cloudResponse.secure_url);
            
            const extractedData = await extractDataFromResume(file.buffer);
            console.log("Found Skills:", extractedData.skills);
            // -----------------------

            // Auto-fill logic
            if (!skills || skills.length === 0) {
                user.profile.skills = extractedData.skills;
            }
            if (!bio) {
                user.profile.bio = extractedData.bio;
            }
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 5. GET ALL USERS (For Chat)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.id } }).select("-password");
        return res.status(200).json({
            users,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}