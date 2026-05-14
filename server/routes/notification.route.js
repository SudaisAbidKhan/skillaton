import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createAnnouncement,
  getAnnouncements,
  markAsRead,
  getUnreadCount,
  deleteAnnouncement,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAnnouncements);
router.get("/unread-count", userAuth, getUnreadCount);

// User routes
router.post("/mark-read", userAuth, markAsRead);

// Admin routes
router.post("/create", userAuth, createAnnouncement);
router.delete("/:id", userAuth, deleteAnnouncement);

export default router;
