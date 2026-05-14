import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import LoadingSpinner from "../../Components/common/LoadingSpinner.jsx";
import Modal from "../../Components/common/Modal.jsx";
import { getAllEvents } from "../../api/events.js";
import { createEvent, deleteEvent } from "../../api/admin.js";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    capacity: "",
    category: "workshop",
    status: "upcoming",
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

  const categoryEmoji = {
    workshop: "🔧",
    seminar: "🎤",
    sports: "⚽",
    social: "🎉",
    academic: "📚",
  };

  const statusColors = {
    upcoming: "bg-green-500",
    ongoing: "bg-blue-500",
    completed: "bg-slate-500",
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
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.eventDate ||
      !formData.location ||
      !formData.capacity
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);
      await createEvent({
        ...formData,
        capacity: parseInt(formData.capacity),
      });
      toast.success("Event created successfully");
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        capacity: "",
        category: "workshop",
        status: "upcoming",
      });
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
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
                Manage Events
              </h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
              >
                + Create Event
              </button>
            </div>
            <p className="text-slate-400 mb-6">
              Create and manage campus events
            </p>

            {/* Events Grid */}
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition"
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-white flex-1">
                          {event.title}
                        </h3>
                        <span className="text-2xl ml-2">
                          {categoryEmoji[event.category] || "📅"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <p className="text-slate-400">
                          📍{" "}
                          <span className="text-white">{event.location}</span>
                        </p>
                        <p className="text-slate-400">
                          📅{" "}
                          <span className="text-white">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          👥{" "}
                          <span className="text-white">
                            {event.registeredCount || 0}/{event.capacity}{" "}
                            Registered
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            statusColors[event.status] || "bg-slate-500"
                          }`}
                        >
                          {event.status.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                          {event.category}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-slate-700">
                        <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-lg mb-4">No events found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                >
                  Create First Event
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        title="Create New Event"
        onClose={() => setShowCreateModal(false)}
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter event title"
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
              placeholder="Enter event description"
              rows="4"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                Event Date *
              </label>
              <input
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                Capacity *
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                placeholder="Max participants"
                min="1"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Event location"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="sports">Sports</option>
                <option value="social">Social</option>
                <option value="academic">Academic</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
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
              {submitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEvents;
