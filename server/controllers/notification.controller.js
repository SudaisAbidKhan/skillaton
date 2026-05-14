import notificationModel from "../models/notification.model.js";
import userModel from "../models/user.model.js";

// Create Announcement (Admin)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, targetRole, priority, expiresAt } = req.body;

    if (!title || !description) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const announcement = await notificationModel.create({
      title,
      description,
      type: "announcement",
      targetRole: targetRole || ["student"],
      priority: priority || "medium",
      createdBy: req.userId,
      expiresAt: expiresAt || null,
      isPublished: true,
    });

    res.json({
      success: true,
      message: "Announcement created",
      announcement,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get All Announcements
export const getAnnouncements = async (req, res) => {
  try {
    const userRole = req.query.role || "student";

    const announcements = await notificationModel
      .find({
        isPublished: true,
        targetRole: userRole,
        $or: [{ expiresAt: null }, { expiresAt: { $gte: Date.now() } }],
      })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, announcements });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Mark as Read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    const notification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { $addToSet: { readBy: req.userId } },
      { new: true },
    );

    if (!notification) {
      return res.json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, message: "Marked as read" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Unread Count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationModel.countDocuments({
      isPublished: true,
      targetRole: "student",
      readBy: { $ne: req.userId },
      $or: [{ expiresAt: null }, { expiresAt: { $gte: Date.now() } }],
    });

    res.json({ success: true, unreadCount: count });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete Announcement (Admin)
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await notificationModel.findById(req.params.id);

    if (!announcement) {
      return res.json({ success: false, message: "Announcement not found" });
    }

    if (announcement.createdBy.toString() !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await notificationModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
