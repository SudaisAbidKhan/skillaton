import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  sendPartnerRequest,
  getPendingPartnerRequests,
  acceptPartnerRequest,
  rejectPartnerRequest,
  getStudentFYPGroup,
  createFYPProject,
  sendSupervisorRequest,
  getPendingSupervisorRequests,
  acceptSupervisorRequest,
  rejectSupervisorRequest,
  getAllFYPProjects,
} from "../controllers/fyp.controller.js";

const router = express.Router();

// Partner Request routes
router.post("/partner-request/send", userAuth, sendPartnerRequest);
router.get("/partner-request/pending", userAuth, getPendingPartnerRequests);
router.post("/partner-request/accept", userAuth, acceptPartnerRequest);
router.post("/partner-request/reject", userAuth, rejectPartnerRequest);

// FYP Group routes
router.get("/my-group", userAuth, getStudentFYPGroup);
router.post("/project/create", userAuth, createFYPProject);

// Supervisor Request routes
router.post("/supervisor-request/send", userAuth, sendSupervisorRequest);
router.get(
  "/supervisor-request/pending",
  userAuth,
  getPendingSupervisorRequests,
);
router.post("/supervisor-request/accept", userAuth, acceptSupervisorRequest);
router.post("/supervisor-request/reject", userAuth, rejectSupervisorRequest);

// Admin routes
router.get("/projects/all", userAuth, getAllFYPProjects);

export default router;
