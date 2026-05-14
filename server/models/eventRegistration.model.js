import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    registrationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered",
    },
  },
  { timestamps: true },
);

// Ensure no duplicate registrations
eventRegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

const eventRegistrationModel =
  mongoose.models.eventRegistrations ||
  mongoose.model("eventRegistrations", eventRegistrationSchema);

export default eventRegistrationModel;
