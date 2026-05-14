import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
  updateProfile,
  getAllUsers,
  updateUserStatus,
} from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", userAuth, getUserProfile);
router.put("/profile", userAuth, updateProfile);

// Admin routes
router.get("/users", userAuth, getAllUsers);
router.put("/users/:userId/status", userAuth, updateUserStatus);

export default router;
