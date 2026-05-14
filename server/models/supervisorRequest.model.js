import mongoose from "mongoose";

const supervisorRequestSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fypGroups",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fypProjects",
      required: true,
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    requestNumber: { type: Number }, // 1st, 2nd, or 3rd request
    respondedAt: { type: Date },
    reason: { type: String }, // For rejection
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const supervisorRequestModel =
  mongoose.models.supervisorRequests ||
  mongoose.model("supervisorRequests", supervisorRequestSchema);

export default supervisorRequestModel;
