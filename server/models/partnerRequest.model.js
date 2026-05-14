import mongoose from "mongoose";

const partnerRequestSchema = new mongoose.Schema(
  {
    fromStudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    toStudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    respondedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const partnerRequestModel =
  mongoose.models.partnerRequests ||
  mongoose.model("partnerRequests", partnerRequestSchema);

export default partnerRequestModel;
