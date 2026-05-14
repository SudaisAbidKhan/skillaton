import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllEvents,
  registerForEvent,
  getStudentEventRegistrations,
  cancelEventRegistration,
} from "../../api/events.js";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import EventCard from "../../Components/events/EventCard.jsx";
import RegistrationHistory from "../../Components/events/RegistrationHistory.jsx";

export default function StudentEvents() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("available");
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, regsRes] = await Promise.all([
        getAllEvents("upcoming"),
        getStudentEventRegistrations(),
      ]);
      setEvents(eventsRes.data.events || []);
      setRegistrations(regsRes.data.registrations || []);
      const ids = new Set(
        regsRes.data.registrations?.map((r) => r.registration.eventId) || [],
      );
      setRegisteredEventIds(ids);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const res = await registerForEvent(eventId);
      if (res.data.success) {
        toast.success("Registered successfully!");
        setRegisteredEventIds((prev) => new Set([...prev, eventId]));
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register");
    }
  };

  const handleCancel = async (registrationId) => {
    if (window.confirm("Are you sure you want to cancel?")) {
      try {
        const res = await cancelEventRegistration(registrationId);
        if (res.data.success) {
          toast.success("Registration cancelled");
          fetchData();
        }
      } catch (error) {
        toast.error("Failed to cancel");
      }
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/student/dashboard", icon: "🏠" },
    { label: "Complaints", path: "/student/complaints", icon: "📋" },
    { label: "Events", path: "/student/events", icon: "📅" },
    { label: "FYP", path: "/student/fyp", icon: "📚" },
    { label: "Profile", path: "/student/profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} menuItems={menuItems} />
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
            <p className="text-slate-400 mb-6">
              Discover and register for campus events
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("available")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                tab === "available"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Available Events
            </button>
            <button
              onClick={() => setTab("registered")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                tab === "registered"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              My Registrations ({registrations.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading events...</p>
            </div>
          ) : tab === "available" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isRegistered={registeredEventIds.has(event._id)}
                  onRegister={() => handleRegister(event._id)}
                />
              ))}
              {events.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400">No events available</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <RegistrationHistory
                  key={reg.registration._id}
                  registration={reg}
                  onCancel={() => handleCancel(reg.registration._id)}
                />
              ))}
              {registrations.length === 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                  <p className="text-slate-400 mb-4">No registrations yet</p>
                  <button
                    onClick={() => setTab("available")}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Browse available events
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
