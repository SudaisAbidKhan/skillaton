import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", userAuth, getUserProfile);
router.put("/profile", userAuth, updateProfile);

export default router;
