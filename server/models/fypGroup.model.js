import mongoose from "mongoose";

const fypGroupSchema = new mongoose.Schema(
  {
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    groupName: { type: String, required: true },
    status: {
      type: String,
      enum: ["forming", "active", "completed", "inactive"],
      default: "forming",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const fypGroupModel =
  mongoose.models.fypGroups || mongoose.model("fypGroups", fypGroupSchema);

export default fypGroupModel;
