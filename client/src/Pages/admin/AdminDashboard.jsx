import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import LoadingSpinner from "../../Components/common/LoadingSpinner.jsx";
import StatCard from "../../Components/dashboard/StatCard.jsx";
import { getDashboardStats } from "../../api/admin.js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const adminMenuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Complaints", path: "/admin/complaints", icon: "⚠️" },
    { label: "Events", path: "/admin/events", icon: "📅" },
    { label: "Users", path: "/admin/users", icon: "👥" },
    { label: "Announcements", path: "/admin/announcements", icon: "📢" },
    { label: "FYP Projects", path: "/admin/fyp", icon: "📋" },
  ];

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
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const complaintStats = stats?.complaints
    ? {
        submitted: stats.complaints.filter((c) => c.status === "submitted")
          .length,
        under_review: stats.complaints.filter(
          (c) => c.status === "under_review",
        ).length,
        resolved: stats.complaints.filter((c) => c.status === "resolved")
          .length,
        pending: stats.complaints.filter(
          (c) => !["resolved", "rejected"].includes(c.status),
        ).length,
      }
    : { submitted: 0, under_review: 0, resolved: 0, pending: 0 };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} onMenuClick={() => setMenuOpen(!menuOpen)} />

      <div className="flex">
        <Sidebar isOpen={menuOpen} menuItems={adminMenuItems} />

        <main className="flex-1 lg:ml-0 transition-all">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mb-8">
              Welcome back, {user?.name}! Here's your campus overview.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Complaints"
                value={stats?.complaints?.length || 0}
                icon="⚠️"
                color="bg-red-500"
                onClick={() => navigate("/admin/complaints")}
              />
              <StatCard
                title="Pending Complaints"
                value={complaintStats.pending}
                icon="⏳"
                color="bg-yellow-500"
                onClick={() => navigate("/admin/complaints")}
              />
              <StatCard
                title="Total Events"
                value={stats?.events?.length || 0}
                icon="📅"
                color="bg-blue-500"
                onClick={() => navigate("/admin/events")}
              />
              <StatCard
                title="Active Users"
                value={stats?.users?.length || 0}
                icon="👥"
                color="bg-green-500"
                onClick={() => navigate("/admin/users")}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Complaints */}
              <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Recent Complaints
                </h2>
                {stats?.complaints?.slice(0, 5).length > 0 ? (
                  <div className="space-y-3">
                    {stats.complaints.slice(0, 5).map((complaint) => (
                      <div
                        key={complaint._id}
                        className="p-3 bg-slate-700 rounded border-l-4 border-red-500 cursor-pointer hover:bg-slate-600 transition"
                        onClick={() => navigate("/admin/complaints")}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">
                              {complaint.title}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              by {complaint.studentId?.name || "Unknown"}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              complaint.status === "submitted"
                                ? "bg-yellow-500 text-black"
                                : complaint.status === "under_review"
                                  ? "bg-blue-500 text-white"
                                  : complaint.status === "resolved"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                            }`}
                          >
                            {complaint.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No complaints yet</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Complaint Status
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Submitted</span>
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                      {complaintStats.submitted}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Under Review</span>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded font-bold">
                      {complaintStats.under_review}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Resolved</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded font-bold">
                      {complaintStats.resolved}
                    </span>
                  </div>
                </div>

                <hr className="border-slate-700 my-4" />

                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">FYP Groups</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.fypProjects?.length || 0}
                  </p>
                  <p className="text-slate-400 text-sm">Active Projects</p>
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="mt-6 bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Upcoming Events
              </h2>
              {stats?.events?.slice(0, 3).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.events.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      className="p-4 bg-slate-700 rounded border border-slate-600 hover:border-blue-500 transition cursor-pointer"
                      onClick={() => navigate("/admin/events")}
                    >
                      <h3 className="text-white font-semibold mb-2">
                        {event.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-2">
                        {event.description?.substring(0, 50)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">
                          📍 {event.location}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            event.status === "upcoming"
                              ? "bg-green-500"
                              : event.status === "ongoing"
                                ? "bg-blue-500"
                                : "bg-slate-500"
                          }`}
                        >
                          {event.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No events scheduled</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
