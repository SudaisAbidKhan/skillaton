import mongoose from "mongoose";

const fypProjectSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fypGroups",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["proposal", "approved", "in_progress", "completed", "rejected"],
      default: "proposal",
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const fypProjectModel =
  mongoose.models.fypProjects ||
  mongoose.model("fypProjects", fypProjectSchema);

export default fypProjectModel;
