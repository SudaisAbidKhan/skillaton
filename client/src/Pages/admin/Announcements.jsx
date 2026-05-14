import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import LoadingSpinner from "../../Components/common/LoadingSpinner.jsx";
import Modal from "../../Components/common/Modal.jsx";
import {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
} from "../../api/admin.js";

const Announcements = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "announcement",
    targetRole: ["student"],
    priority: "medium",
  });
  const [submitting, setSubmitting] = useState(false);

  const adminMenuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Complaints", path: "/admin/complaints", icon: "⚠️" },
    { label: "Events", path: "/admin/events", icon: "📅" },
    { label: "Users", path: "/admin/users", icon: "👥" },
    { label: "Announcements", path: "/admin/announcements", icon: "📢" },
    { label: "FYP Projects", path: "/admin/fyp", icon: "📋" },
  ];

  const typeEmoji = {
    announcement: "📢",
    alert: "⚠️",
    update: "🔄",
    reminder: "🔔",
  };

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      navigate("/student/dashboard");
      return;
    }

    setUser(parsedUser);
    fetchAnnouncements();
  }, [navigate]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAllAnnouncements();
      setAnnouncements(data.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await createAnnouncement({
        ...formData,
        isPublished: true,
      });
      toast.success("Announcement created successfully");
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        type: "announcement",
        targetRole: ["student"],
        priority: "medium",
      });
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    try {
      await deleteAnnouncement(announcementId);
      toast.success("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const handleToggleRole = (role) => {
    setFormData((prev) => {
      const roles = prev.targetRole;
      if (roles.includes(role)) {
        return {
          ...prev,
          targetRole: roles.filter((r) => r !== role),
        };
      } else {
        return {
          ...prev,
          targetRole: [...roles, role],
        };
      }
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} onMenuClick={() => setMenuOpen(!menuOpen)} />

      <div className="flex">
        <Sidebar isOpen={menuOpen} menuItems={adminMenuItems} />

        <main className="flex-1 lg:ml-0 transition-all">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Announcements
              </h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
              >
                + Create Announcement
              </button>
            </div>
            <p className="text-slate-400 mb-6">
              Create and manage campus announcements
            </p>

            {/* Announcements List */}
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-blue-500 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">
                          {typeEmoji[announcement.type] || "📢"}
                        </span>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {announcement.title}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            by {announcement.createdBy?.name || "Admin"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded text-white ${
                            priorityColors[announcement.priority] ||
                            "bg-slate-500"
                          }`}
                        >
                          {announcement.priority.toUpperCase()}
                        </span>
                        <span className="text-xs bg-slate-700 px-3 py-1 rounded text-slate-300">
                          {announcement.type.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4">
                      {announcement.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-700">
                      {announcement.targetRole?.map((role) => (
                        <span
                          key={role}
                          className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded"
                        >
                          👥 {role}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-slate-400 text-sm">
                        <p>
                          👁️ Read by{" "}
                          <span className="text-white font-semibold">
                            {announcement.readBy?.length || 0}
                          </span>{" "}
                          users
                        </p>
                        <p>
                          📅{" "}
                          {new Date(
                            announcement.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-lg mb-4">
                  No announcements yet
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                >
                  Create First Announcement
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Announcement Modal */}
      <Modal
        isOpen={showCreateModal}
        title="Create New Announcement"
        onClose={() => setShowCreateModal(false)}
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Announcement title"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Announcement description"
              rows="5"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="update">Update</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-3">
              Target Roles
            </label>
            <div className="space-y-2">
              {["student", "teacher", "admin"].map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.targetRole.includes(role)}
                    onChange={() => handleToggleRole(role)}
                    className="w-4 h-4 rounded bg-slate-700 border border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-300">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 text-white rounded font-medium transition"
            >
              {submitting ? "Creating..." : "Create Announcement"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;
