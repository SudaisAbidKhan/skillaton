import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import LoadingSpinner from "../../Components/common/LoadingSpinner.jsx";
import Modal from "../../Components/common/Modal.jsx";
import { getAllComplaints, respondToComplaint } from "../../api/admin.js";

const ManageComplaints = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [response, setResponse] = useState("");
  const [responding, setResponding] = useState(false);

  const adminMenuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Complaints", path: "/admin/complaints", icon: "⚠️" },
    { label: "Events", path: "/admin/events", icon: "📅" },
    { label: "Users", path: "/admin/users", icon: "👥" },
    { label: "Announcements", path: "/admin/announcements", icon: "📢" },
    { label: "FYP Projects", path: "/admin/fyp", icon: "📋" },
  ];

  const statusColors = {
    submitted: "bg-yellow-500 text-black",
    under_review: "bg-blue-500 text-white",
    acknowledged: "bg-purple-500 text-white",
    resolved: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white",
  };

  const priorityColors = {
    low: "border-blue-500",
    medium: "border-yellow-500",
    high: "border-orange-500",
    critical: "border-red-500",
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
    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAllComplaints();
      setComplaints(data.data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (complaint) => {
    setSelectedComplaint(complaint);
    setResponse("");
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      setResponding(true);
      await respondToComplaint(selectedComplaint._id, response);
      toast.success("Response submitted successfully");
      setShowResponseModal(false);
      setSelectedComplaint(null);
      setResponse("");
      fetchComplaints();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
    } finally {
      setResponding(false);
    }
  };

  const filteredComplaints =
    activeStatus === "all"
      ? complaints
      : complaints.filter((c) => c.status === activeStatus);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} onMenuClick={() => setMenuOpen(!menuOpen)} />

      <div className="flex">
        <Sidebar isOpen={menuOpen} menuItems={adminMenuItems} />

        <main className="flex-1 lg:ml-0 transition-all">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Manage Complaints
            </h1>
            <p className="text-slate-400 mb-6">
              Review and respond to student complaints
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-700">
              {[
                "all",
                "submitted",
                "under_review",
                "acknowledged",
                "resolved",
                "rejected",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    activeStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Complaints List */}
            {filteredComplaints.length > 0 ? (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className={`bg-slate-800 border-l-4 rounded-lg p-6 hover:bg-slate-750 transition ${
                      priorityColors[complaint.priority] || "border-slate-600"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {complaint.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-2">
                          Student:{" "}
                          <span className="text-white font-semibold">
                            {complaint.studentId?.name}
                          </span>
                        </p>
                        <p className="text-slate-400 text-sm">
                          Email: {complaint.studentId?.email}
                        </p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded ${
                            statusColors[complaint.status] || "bg-slate-500"
                          }`}
                        >
                          {complaint.status.toUpperCase()}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded ${
                            complaint.priority === "critical"
                              ? "bg-red-600"
                              : complaint.priority === "high"
                                ? "bg-orange-600"
                                : complaint.priority === "medium"
                                  ? "bg-yellow-600"
                                  : "bg-blue-600"
                          }`}
                        >
                          {complaint.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-700 p-4 rounded mb-4 border border-slate-600">
                      <p className="text-slate-300">
                        <span className="text-white font-semibold">
                          Category:
                        </span>{" "}
                        {complaint.category}
                      </p>
                      <p className="text-slate-300 mt-2">
                        <span className="text-white font-semibold">
                          Description:
                        </span>
                      </p>
                      <p className="text-slate-400 mt-1">
                        {complaint.description}
                      </p>
                    </div>

                    {complaint.adminResponse && (
                      <div className="bg-green-900 bg-opacity-30 p-4 rounded mb-4 border border-green-700">
                        <p className="text-green-400 font-semibold mb-2">
                          ✓ Admin Response:
                        </p>
                        <p className="text-slate-300">
                          {complaint.adminResponse}
                        </p>
                        <p className="text-slate-500 text-sm mt-2">
                          Responded by: {complaint.respondedBy?.name} •{" "}
                          {new Date(complaint.respondedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {complaint.status !== "resolved" &&
                        complaint.status !== "rejected" && (
                          <button
                            onClick={() => handleRespond(complaint)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                          >
                            Respond
                          </button>
                        )}
                      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-lg">No complaints found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Response Modal */}
      <Modal
        isOpen={showResponseModal}
        title={`Respond to: ${selectedComplaint?.title}`}
        onClose={() => setShowResponseModal(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Your Response
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write your response to address this complaint..."
              rows="6"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowResponseModal(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitResponse}
              disabled={responding}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 text-white rounded font-medium transition"
            >
              {responding ? "Submitting..." : "Submit Response"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageComplaints;
