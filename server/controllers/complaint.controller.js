import complaintModel from "../models/complaint.model.js";
import userModel from "../models/user.model.js";

// Submit Complaint
export const submitComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const complaint = await complaintModel.create({
      studentId: req.userId,
      title,
      description,
      category,
      priority: priority || "medium",
    });

    res.json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Student's Complaints
export const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await complaintModel
      .find({ studentId: req.userId })
      .populate("respondedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, complaints });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get All Complaints (Admin)
export const getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await complaintModel
      .find(filter)
      .populate("studentId", "name email phone studentId")
      .populate("respondedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, complaints });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Single Complaint
export const getComplaint = async (req, res) => {
  try {
    const complaint = await complaintModel
      .findById(req.params.id)
      .populate("studentId", "name email phone studentId department semester")
      .populate("respondedBy", "name email");

    if (!complaint) {
      return res.json({ success: false, message: "Complaint not found" });
    }

    res.json({ success: true, complaint });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Respond to Complaint (Admin)
export const respondToComplaint = async (req, res) => {
  try {
    const { adminResponse, status } = req.body;

    if (!adminResponse || !status) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const complaint = await complaintModel.findByIdAndUpdate(
      req.params.id,
      {
        adminResponse,
        status,
        respondedBy: req.userId,
        respondedAt: Date.now(),
        updatedAt: Date.now(),
      },
      { new: true },
    );

    if (!complaint) {
      return res.json({ success: false, message: "Complaint not found" });
    }

    res.json({
      success: true,
      message: "Complaint updated",
      complaint,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete Complaint (Student - only if status is submitted)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await complaintModel.findById(req.params.id);

    if (!complaint) {
      return res.json({ success: false, message: "Complaint not found" });
    }

    if (complaint.studentId.toString() !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (complaint.status !== "submitted") {
      return res.json({
        success: false,
        message: "Can only delete submitted complaints",
      });
    }

    await complaintModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Complaint deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
