import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import LoadingSpinner from "../../Components/common/LoadingSpinner.jsx";
import Modal from "../../Components/common/Modal.jsx";
import { getAllFYPProjects } from "../../api/admin.js";

const ManageFYP = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const adminMenuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Complaints", path: "/admin/complaints", icon: "⚠️" },
    { label: "Events", path: "/admin/events", icon: "📅" },
    { label: "Users", path: "/admin/users", icon: "👥" },
    { label: "Announcements", path: "/admin/announcements", icon: "📢" },
    { label: "FYP Projects", path: "/admin/fyp", icon: "📋" },
  ];

  const statusColors = {
    proposal: "bg-yellow-500",
    approved: "bg-blue-500",
    in_progress: "bg-purple-500",
    completed: "bg-green-500",
    rejected: "bg-red-500",
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
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllFYPProjects();
      setProjects(data.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load FYP projects");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    activeStatus === "all"
      ? projects
      : projects.filter((p) => p.status === activeStatus);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} onMenuClick={() => setMenuOpen(!menuOpen)} />

      <div className="flex">
        <Sidebar isOpen={menuOpen} menuItems={adminMenuItems} />

        <main className="flex-1 lg:ml-0 transition-all">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              FYP Projects Management
            </h1>
            <p className="text-slate-400 mb-6">
              Monitor and review final year projects
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-700">
              {[
                "all",
                "proposal",
                "approved",
                "in_progress",
                "completed",
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

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-white flex-1 line-clamp-2">
                          {project.title}
                        </h3>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded text-white ml-2 flex-shrink-0 ${
                            statusColors[project.status] || "bg-slate-500"
                          }`}
                        >
                          {project.status.toUpperCase().replace("_", " ")}
                        </span>
                      </div>

                      <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                        {project.description}
                      </p>

                      <div className="space-y-3 mb-4 pb-4 border-b border-slate-700">
                        <div>
                          <p className="text-slate-500 text-xs">Group Leader</p>
                          <p className="text-white font-semibold">
                            {project.groupId?.leaderId?.name || "Unknown"}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500 text-xs">Team Members</p>
                          <p className="text-slate-400 text-sm">
                            {project.groupId?.members?.length || 0} members
                          </p>
                        </div>

                        {project.supervisorId && (
                          <div>
                            <p className="text-slate-500 text-xs">Supervisor</p>
                            <p className="text-blue-400 font-semibold">
                              {project.supervisorId?.name || "Assigned"}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowDetailsModal(true);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-lg">No FYP projects found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Project Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        title={`Project: ${selectedProject?.title}`}
        onClose={() => setShowDetailsModal(false)}
      >
        {selectedProject && (
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm font-semibold">
                Description
              </p>
              <p className="text-slate-300 mt-2">
                {selectedProject.description}
              </p>
            </div>

            <div className="bg-slate-700 p-4 rounded space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Group Leader</p>
                <p className="text-white font-semibold">
                  {selectedProject.groupId?.leaderId?.name}
                </p>
                <p className="text-slate-400 text-sm">
                  {selectedProject.groupId?.leaderId?.email}
                </p>
              </div>

              <hr className="border-slate-600" />

              <div>
                <p className="text-slate-400 text-sm font-semibold mb-2">
                  Team Members ({selectedProject.groupId?.members?.length})
                </p>
                <div className="space-y-2">
                  {selectedProject.groupId?.members?.map((member) => (
                    <div
                      key={member._id}
                      className="bg-slate-600 p-2 rounded text-sm"
                    >
                      <p className="text-white font-semibold">{member.name}</p>
                      <p className="text-slate-400 text-xs">{member.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {selectedProject.supervisorId && (
              <div className="bg-blue-900 bg-opacity-30 p-4 rounded border border-blue-700">
                <p className="text-blue-400 font-semibold mb-2">
                  ✓ Assigned Supervisor
                </p>
                <p className="text-white font-semibold">
                  {selectedProject.supervisorId?.name}
                </p>
                <p className="text-slate-300 text-sm">
                  {selectedProject.supervisorId?.email}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded text-white mt-1 ${
                    statusColors[selectedProject.status]
                  }`}
                >
                  {selectedProject.status.toUpperCase().replace("_", " ")}
                </span>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Created</p>
                <p className="text-white font-semibold mt-1">
                  {new Date(selectedProject.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageFYP;
