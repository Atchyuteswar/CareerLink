import express from "express";
import { login, logout, register, updateProfile, getAllUsers, changePassword, deleteAccount, searchCandidates } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/getall").get(isAuthenticated, getAllUsers);
router.route("/change-password").post(isAuthenticated, changePassword);
router.route("/delete-account").delete(isAuthenticated, deleteAccount);
router.route("/candidates").get(isAuthenticated, searchCandidates);

export default router;