import eventModel from "../models/event.model.js";
import eventRegistrationModel from "../models/eventRegistration.model.js";

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) filter.status = status;

    const events = await eventModel
      .find(filter)
      .populate("createdBy", "name email")
      .sort({ eventDate: 1 });

    // Get registration count for each event
    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await eventRegistrationModel.countDocuments({
          eventId: event._id,
        });
        return {
          ...event.toObject(),
          registeredCount: registrationCount,
          seatsAvailable: event.capacity - registrationCount,
        };
      }),
    );

    res.json({ success: true, events: eventsWithCount });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Single Event
export const getEvent = async (req, res) => {
  try {
    const event = await eventModel
      .findById(req.params.id)
      .populate("createdBy", "name email");

    if (!event) {
      return res.json({ success: false, message: "Event not found" });
    }

    const registrationCount = await eventRegistrationModel.countDocuments({
      eventId: event._id,
    });

    res.json({
      success: true,
      event: {
        ...event.toObject(),
        registeredCount: registrationCount,
        seatsAvailable: event.capacity - registrationCount,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create Event (Admin)
export const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, location, capacity, category } =
      req.body;

    if (!title || !description || !eventDate || !location || !capacity) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const event = await eventModel.create({
      title,
      description,
      eventDate,
      location,
      capacity,
      category: category || "academic",
      createdBy: req.userId,
    });

    res.json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Register for Event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.json({ success: false, message: "Event ID is required" });
    }

    // Check if event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.json({ success: false, message: "Event not found" });
    }

    // Check if already registered
    const existingRegistration = await eventRegistrationModel.findOne({
      eventId,
      studentId: req.userId,
    });

    if (existingRegistration) {
      return res.json({
        success: false,
        message: "Already registered for this event",
      });
    }

    // Check capacity
    const registrationCount = await eventRegistrationModel.countDocuments({
      eventId,
    });

    if (registrationCount >= event.capacity) {
      return res.json({ success: false, message: "Event is full" });
    }

    // Register
    const registration = await eventRegistrationModel.create({
      eventId,
      studentId: req.userId,
    });

    res.json({
      success: true,
      message: "Registered successfully",
      registration,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Student's Event Registrations
export const getStudentEventRegistrations = async (req, res) => {
  try {
    const registrations = await eventRegistrationModel
      .find({ studentId: req.userId })
      .populate("eventId")
      .sort({ registrationDate: -1 });

    const eventsWithDetails = await Promise.all(
      registrations.map(async (reg) => {
        const event = reg.eventId;
        const totalRegistrations = await eventRegistrationModel.countDocuments({
          eventId: event._id,
        });
        return {
          registration: reg,
          event: {
            ...event.toObject(),
            seatsAvailable: event.capacity - totalRegistrations,
          },
        };
      }),
    );

    res.json({ success: true, registrations: eventsWithDetails });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Cancel Event Registration
export const cancelEventRegistration = async (req, res) => {
  try {
    const registration = await eventRegistrationModel.findById(req.params.id);

    if (!registration) {
      return res.json({ success: false, message: "Registration not found" });
    }

    if (registration.studentId.toString() !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (registration.status !== "registered") {
      return res.json({
        success: false,
        message: "Can only cancel registered events",
      });
    }

    await eventRegistrationModel.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true },
    );

    res.json({ success: true, message: "Registration cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Event Registrations (Admin)
export const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await eventRegistrationModel
      .find({ eventId: req.params.eventId })
      .populate("studentId", "name email studentId department semester");

    res.json({ success: true, registrations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
