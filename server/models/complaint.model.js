import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["academic", "facility", "harassment", "administration", "other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "acknowledged",
        "resolved",
        "rejected",
      ],
      default: "submitted",
    },
    attachmentUrl: { type: String },
    adminResponse: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const complaintModel =
  mongoose.models.complaints || mongoose.model("complaints", complaintSchema);

export default complaintModel;
