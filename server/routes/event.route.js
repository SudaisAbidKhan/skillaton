import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getAllEvents,
  getEvent,
  createEvent,
  registerForEvent,
  getStudentEventRegistrations,
  cancelEventRegistration,
  getEventRegistrations,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEvent);

// Student routes
router.post("/register", userAuth, registerForEvent);
router.get("/my-registrations", userAuth, getStudentEventRegistrations);
router.delete("/registration/:id", userAuth, cancelEventRegistration);

// Admin routes
router.post("/create", userAuth, createEvent);
router.put("/:eventId", userAuth, updateEvent);
router.delete("/:eventId", userAuth, deleteEvent);
router.get("/:eventId/registrations", userAuth, getEventRegistrations);

export default router;
