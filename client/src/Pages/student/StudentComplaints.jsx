import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  submitComplaint,
  getStudentComplaints,
  deleteComplaint,
} from "../../api/complaints.js";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import ComplaintForm from "../../Components/complaints/ComplaintForm.jsx";
import ComplaintCard from "../../Components/complaints/ComplaintCard.jsx";

export default function StudentComplaints() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getStudentComplaints();
      setComplaints(res.data.complaints || []);
    } catch (error) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (formData) => {
    try {
      const res = await submitComplaint(formData);
      if (res.data.success) {
        toast.success("Complaint submitted successfully");
        setShowForm(false);
        fetchComplaints();
      }
    } catch (error) {
      toast.error("Failed to submit complaint");
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        const res = await deleteComplaint(id);
        if (res.data.success) {
          toast.success("Complaint deleted");
          fetchComplaints();
        }
      } catch (error) {
        toast.error("Failed to delete complaint");
      }
    }
  };

  const filteredComplaints =
    filter === "all"
      ? complaints
      : complaints.filter((c) => c.status === filter);

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Complaints</h1>
              <p className="text-slate-400">Manage and track your complaints</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {showForm ? "Cancel" : "New Complaint"}
            </button>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
              <ComplaintForm onSubmit={handleSubmitComplaint} />
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors capitalize ${
                  filter === status
                    ? "bg-blue-700 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Complaints List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading complaints...</p>
            </div>
          ) : filteredComplaints.length > 0 ? (
            <div className="grid gap-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  onDelete={() => handleDeleteComplaint(complaint._id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
              <p className="text-slate-400 mb-4">No complaints found</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                Submit your first complaint
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
