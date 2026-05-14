import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getStudentComplaints } from "../../api/complaints.js";
import { getStudentEventRegistrations } from "../../api/events.js";
import { getStudentFYPGroup } from "../../api/fyp.js";
import { getAnnouncements } from "../../api/notifications.js";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import StatCard from "../../Components/dashboard/StatCard.jsx";
import AnnouncementWidget from "../../Components/dashboard/AnnouncementWidget.jsx";
import PendingActions from "../../Components/dashboard/PendingActions.jsx";
import RecentActivity from "../../Components/dashboard/RecentActivity.jsx";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    complaints: 0,
    events: 0,
    fypGroup: false,
    announcements: 0,
  });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [complaintsRes, eventsRes, fypRes, announcementsRes] =
        await Promise.all([
          getStudentComplaints(),
          getStudentEventRegistrations(),
          getStudentFYPGroup(),
          getAnnouncements("student"),
        ]);

      setStats({
        complaints: complaintsRes.data.complaints?.length || 0,
        events: eventsRes.data.registrations?.length || 0,
        fypGroup: !!fypRes.data.group,
        announcements: announcementsRes.data.announcements?.length || 0,
      });

      setAnnouncements(announcementsRes.data.announcements || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-slate-400">
              Here's an overview of your campus activities
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Active Complaints"
              value={stats.complaints}
              icon="📋"
              color="bg-blue-500"
              onClick={() => navigate("/student/complaints")}
            />
            <StatCard
              title="Registered Events"
              value={stats.events}
              icon="📅"
              color="bg-emerald-500"
              onClick={() => navigate("/student/events")}
            />
            <StatCard
              title="FYP Group"
              value={stats.fypGroup ? "Active" : "Not Joined"}
              icon="📚"
              color={stats.fypGroup ? "bg-purple-500" : "bg-slate-600"}
              onClick={() => navigate("/student/fyp")}
            />
            <StatCard
              title="Announcements"
              value={stats.announcements}
              icon="📢"
              color="bg-orange-500"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Announcements & Actions */}
            <div className="lg:col-span-2 space-y-6">
              <AnnouncementWidget announcements={announcements.slice(0, 3)} />
              <PendingActions />
            </div>

            {/* Right Column - Recent Activity */}
            <div>
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
