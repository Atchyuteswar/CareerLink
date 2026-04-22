import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getAppliedJobs, getApplicants, updateStatus, withdrawApplication, addApplicationNote } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/withdraw/:id").post(isAuthenticated, withdrawApplication);
router.route("/note/:id").post(isAuthenticated, addApplicationNote);

export default router;