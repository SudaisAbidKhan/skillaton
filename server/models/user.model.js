import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "admin", "teacher"],
      required: true,
    },
    phone: { type: String },
    department: { type: String }, // e.g., "CS", "SE", "ENG"
    semester: { type: Number }, // for students
    studentId: { type: String }, // unique student ID
    registrationNumber: { type: String }, // registration number
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;
