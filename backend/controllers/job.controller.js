import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// 1. POST A NEW JOB (Admin/Recruiter only)
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, benefits, workMode } = req.body;
        
        // Check for required fields (Add workMode if strict)
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId || !workMode) {
            return res.status(400).json({ message: "Something is missing.", success: false });
        };

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: req.id,
            benefits,   // <--- New
            workMode    // <--- New
        });

        // ... (rest of the function) ...
    } catch (error) {
        console.log(error);
    }
}

// 2. GET ALL JOBS (For Students)
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// 3. GET JOB BY ID (For Details Page)
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

// 4. GET JOBS BY ADMIN (The jobs created by the logged-in recruiter)
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// 5. UPDATE JOB
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const updateData = req.body;

        const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };
        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// 6. DELETE JOB
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndDelete(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };
        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// 7. TOGGLE SAVE JOB
export const toggleSaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        // Check if job is already in bookmarks
        const isBookmarked = user.bookmarks.includes(jobId);

        if (isBookmarked) {
            // Remove it
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== jobId);
            await user.save();
            return res.status(200).json({ message: "Job removed from bookmarks.", success: true, isBookmarked: false });
        } else {
            // Add it
            user.bookmarks.push(jobId);
            await user.save();
            return res.status(200).json({ message: "Job saved for later.", success: true, isBookmarked: true });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 8. GET SAVED JOBS (Bookmarks)
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        
        // Find user and populate the bookmarks array with actual Job data
        const user = await User.findById(userId).populate({
            path: 'bookmarks',
            populate: {
                path: 'company' // Also populate company details inside the job
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            })
        };

        return res.status(200).json({
            savedJobs: user.bookmarks,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}