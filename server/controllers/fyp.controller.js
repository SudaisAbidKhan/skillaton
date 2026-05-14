import fypGroupModel from "../models/fypGroup.model.js";
import fypProjectModel from "../models/fypProject.model.js";
import partnerRequestModel from "../models/partnerRequest.model.js";
import supervisorRequestModel from "../models/supervisorRequest.model.js";
import userModel from "../models/user.model.js";

// Send Partner Request
export const sendPartnerRequest = async (req, res) => {
  try {
    const { toStudentId, message } = req.body;

    if (!toStudentId) {
      return res.json({ success: false, message: "Student ID is required" });
    }

    if (toStudentId === req.userId) {
      return res.json({
        success: false,
        message: "Cannot send request to yourself",
      });
    }

    // Check if already in a group
    const existingGroup = await fypGroupModel.findOne({
      members: req.userId,
    });

    if (existingGroup) {
      return res.json({
        success: false,
        message: "You are already in a group",
      });
    }

    // Check if request already exists
    const existingRequest = await partnerRequestModel.findOne({
      fromStudentId: req.userId,
      toStudentId,
      status: "pending",
    });

    if (existingRequest) {
      return res.json({
        success: false,
        message: "Request already sent to this student",
      });
    }

    const partnerRequest = await partnerRequestModel.create({
      fromStudentId: req.userId,
      toStudentId,
      message: message || "",
    });

    res.json({
      success: true,
      message: "Partner request sent",
      partnerRequest,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Pending Partner Requests
export const getPendingPartnerRequests = async (req, res) => {
  try {
    const requests = await partnerRequestModel
      .find({ toStudentId: req.userId, status: "pending" })
      .populate("fromStudentId", "name email studentId department semester");

    res.json({ success: true, requests });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Accept Partner Request
export const acceptPartnerRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await partnerRequestModel.findById(requestId);
    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (request.toStudentId.toString() !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Check if both students are already in a group
    const groupLeader = await fypGroupModel.findOne({
      members: request.fromStudentId,
    });

    const groupMember = await fypGroupModel.findOne({
      members: req.userId,
    });

    if (groupLeader || groupMember) {
      return res.json({
        success: false,
        message: "One or both students are already in a group",
      });
    }

    // Create new group with fromStudent as leader
    const newGroup = await fypGroupModel.create({
      leaderId: request.fromStudentId,
      members: [request.fromStudentId, req.userId],
      groupName: `Group - ${request.fromStudentId}`,
    });

    // Update request status
    await partnerRequestModel.findByIdAndUpdate(
      requestId,
      { status: "accepted", respondedAt: Date.now() },
      { new: true },
    );

    // Reject all other pending requests for both students
    await partnerRequestModel.updateMany(
      {
        $or: [
          { fromStudentId: request.fromStudentId, status: "pending" },
          { toStudentId: request.fromStudentId, status: "pending" },
          { fromStudentId: req.userId, status: "pending" },
          { toStudentId: req.userId, status: "pending" },
        ],
        _id: { $ne: requestId },
      },
      { status: "rejected", respondedAt: Date.now() },
    );

    res.json({
      success: true,
      message: "Partner request accepted. Group created!",
      group: newGroup,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Reject Partner Request
export const rejectPartnerRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await partnerRequestModel.findById(requestId);
    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (request.toStudentId.toString() !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await partnerRequestModel.findByIdAndUpdate(
      requestId,
      { status: "rejected", respondedAt: Date.now() },
      { new: true },
    );

    res.json({ success: true, message: "Partner request rejected" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Student's FYP Group
export const getStudentFYPGroup = async (req, res) => {
  try {
    const group = await fypGroupModel
      .findOne({
        $or: [{ leaderId: req.userId }, { members: req.userId }],
      })
      .populate("leaderId", "name email studentId department")
      .populate("members", "name email studentId department");

    if (!group) {
      return res.json({ success: false, message: "No group found" });
    }

    // Get project for this group
    const project = await fypProjectModel
      .findOne({ groupId: group._id })
      .populate("supervisorId", "name email");

    res.json({ success: true, group, project });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create FYP Project (Group Leader)
export const createFYPProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Check if user is group leader
    const group = await fypGroupModel.findOne({ leaderId: req.userId });

    if (!group) {
      return res.json({
        success: false,
        message: "You must be a group leader to create a project",
      });
    }

    // Check if project already exists
    const existingProject = await fypProjectModel.findOne({
      groupId: group._id,
    });

    if (existingProject) {
      return res.json({
        success: false,
        message: "Project already exists for your group",
      });
    }

    const project = await fypProjectModel.create({
      groupId: group._id,
      title,
      description,
    });

    res.json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Send Supervisor Request
export const sendSupervisorRequest = async (req, res) => {
  try {
    const { supervisorId } = req.body;

    if (!supervisorId) {
      return res.json({ success: false, message: "Supervisor ID is required" });
    }

    // Check if user is group leader
    const group = await fypGroupModel.findOne({ leaderId: req.userId });

    if (!group) {
      return res.json({
        success: false,
        message: "You must be a group leader to send supervisor requests",
      });
    }

    // Get project
    const project = await fypProjectModel.findOne({ groupId: group._id });

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found. Create a project first",
      });
    }

    // Check if supervisor already assigned
    if (project.supervisorId) {
      return res.json({
        success: false,
        message: "Supervisor already assigned to this project",
      });
    }

    // Count pending requests
    const pendingCount = await supervisorRequestModel.countDocuments({
      projectId: project._id,
      status: "pending",
    });

    if (pendingCount >= 3) {
      return res.json({
        success: false,
        message: "Maximum 3 supervisor requests allowed",
      });
    }

    // Check if already requested
    const existingRequest = await supervisorRequestModel.findOne({
      projectId: project._id,
      supervisorId,
      status: "pending",
    });

    if (existingRequest) {
      return res.json({
        success: false,
        message: "Request already sent to this supervisor",
      });
    }

    const supervisorRequest = await supervisorRequestModel.create({
      groupId: group._id,
      projectId: project._id,
      supervisorId,
      requestNumber: pendingCount + 1,
    });

    res.json({
      success: true,
      message: "Supervisor request sent",
      supervisorRequest,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Pending Supervisor Requests (Teacher)
export const getPendingSupervisorRequests = async (req, res) => {
  try {
    const requests = await supervisorRequestModel
      .find({ supervisorId: req.userId, status: "pending" })
      .populate("groupId", "groupName")
      .populate("projectId", "title description")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Accept Supervisor Request (Teacher)
export const acceptSupervisorRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const supervisorRequest = await supervisorRequestModel.findById(requestId);

    if (!supervisorRequest) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (supervisorRequest.supervisorId.toString() !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Update project with supervisor
    await fypProjectModel.findByIdAndUpdate(
      supervisorRequest.projectId,
      { supervisorId: req.userId },
      { new: true },
    );

    // Update request status
    await supervisorRequestModel.findByIdAndUpdate(
      requestId,
      { status: "accepted", respondedAt: Date.now() },
      { new: true },
    );

    // Reject all other pending requests for this project
    await supervisorRequestModel.updateMany(
      {
        projectId: supervisorRequest.projectId,
        status: "pending",
        _id: { $ne: requestId },
      },
      { status: "rejected", respondedAt: Date.now() },
    );

    res.json({
      success: true,
      message: "Supervisor request accepted",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Reject Supervisor Request (Teacher)
export const rejectSupervisorRequest = async (req, res) => {
  try {
    const { requestId, reason } = req.body;

    const supervisorRequest = await supervisorRequestModel.findById(requestId);

    if (!supervisorRequest) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (supervisorRequest.supervisorId.toString() !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await supervisorRequestModel.findByIdAndUpdate(
      requestId,
      { status: "rejected", respondedAt: Date.now(), reason: reason || "" },
      { new: true },
    );

    res.json({
      success: true,
      message: "Supervisor request rejected",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get All FYP Projects (Admin)
export const getAllFYPProjects = async (req, res) => {
  try {
    const projects = await fypProjectModel
      .find()
      .populate("groupId")
      .populate("supervisorId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
