import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createReview, getCompanyReviews, toggleHelpful } from "../controllers/review.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createReview);
router.route("/company/:companyId").get(getCompanyReviews);
router.route("/helpful/:reviewId").post(isAuthenticated, toggleHelpful);

export default router;
