import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  submitComplaint,
  getStudentComplaints,
  getAllComplaints,
  getComplaint,
  respondToComplaint,
  deleteComplaint,
} from "../controllers/complaint.controller.js";

const router = express.Router();

// Student routes
router.post("/submit", userAuth, submitComplaint);
router.get("/my-complaints", userAuth, getStudentComplaints);
router.delete("/:id", userAuth, deleteComplaint);

// Admin routes
router.get("/", userAuth, getAllComplaints);
router.get("/:id", userAuth, getComplaint);
router.put("/:id/respond", userAuth, respondToComplaint);

export default router;
