import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fypProjects",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "overdue"],
      default: "pending",
    },
    completedAt: { type: Date },
    feedback: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const milestoneModel =
  mongoose.models.milestones || mongoose.model("milestones", milestoneSchema);

export default milestoneModel;
