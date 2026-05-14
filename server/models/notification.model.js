import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["announcement", "alert", "update", "reminder"],
      default: "announcement",
    },
    targetRole: {
      type: [String],
      enum: ["student", "admin", "teacher"],
      default: ["student"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isPublished: { type: Boolean, default: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const notificationModel =
  mongoose.models.notifications ||
  mongoose.model("notifications", notificationSchema);

export default notificationModel;
