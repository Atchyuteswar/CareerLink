import { Review } from "../models/review.model.js";

// 1. CREATE A REVIEW
export const createReview = async (req, res) => {
    try {
        const { company, rating, title, pros, cons, reviewType, isAnonymous, ratings } = req.body;
        if (!company || !rating || !title) {
            return res.status(400).json({ message: "Rating, title, and company are required.", success: false });
        }
        const review = await Review.create({
            company, reviewer: req.id, rating, title, pros, cons,
            reviewType: reviewType || 'employee',
            isAnonymous: isAnonymous || false,
            ratings: ratings || {}
        });
        const populated = await Review.findById(review._id).populate('reviewer', 'fullname profile.profilePhoto');
        return res.status(201).json({ review: populated, success: true, message: "Review posted!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// 2. GET REVIEWS BY COMPANY
export const getCompanyReviews = async (req, res) => {
    try {
        const { companyId } = req.params;
        const reviews = await Review.find({ company: companyId })
            .populate('reviewer', 'fullname profile.profilePhoto')
            .sort({ createdAt: -1 });
        
        // Compute average ratings
        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / totalReviews).toFixed(1) : 0;
        const avgRatings = totalReviews > 0 ? {
            culture: (reviews.reduce((a, r) => a + (r.ratings?.culture || 3), 0) / totalReviews).toFixed(1),
            workLifeBalance: (reviews.reduce((a, r) => a + (r.ratings?.workLifeBalance || 3), 0) / totalReviews).toFixed(1),
            salary: (reviews.reduce((a, r) => a + (r.ratings?.salary || 3), 0) / totalReviews).toFixed(1),
            growth: (reviews.reduce((a, r) => a + (r.ratings?.growth || 3), 0) / totalReviews).toFixed(1),
        } : null;

        return res.status(200).json({ reviews, avgRating, avgRatings, totalReviews, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// 3. TOGGLE HELPFUL
export const toggleHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: "Review not found.", success: false });
        
        const userId = req.id;
        const idx = review.helpful.indexOf(userId);
        if (idx > -1) {
            review.helpful.splice(idx, 1);
        } else {
            review.helpful.push(userId);
        }
        await review.save();
        return res.status(200).json({ helpfulCount: review.helpful.length, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}
