import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  sendPartnerRequest,
  getPendingPartnerRequests,
  acceptPartnerRequest,
  rejectPartnerRequest,
  getStudentFYPGroup,
  createFYPProject,
  sendSupervisorRequest,
  getPendingSupervisorRequests,
  acceptSupervisorRequest,
  rejectSupervisorRequest,
} from "../../api/fyp.js";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import PartnerRequestCard from "../../Components/fyp/PartnerRequestCard.jsx";
import ProjectCard from "../../Components/fyp/ProjectCard.jsx";
import GroupMembersPanel from "../../Components/fyp/GroupMembersPanel.jsx";
import SupervisorRequestCard from "../../Components/fyp/SupervisorRequestCard.jsx";

export default function StudentFYP() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState("overview");
  const [group, setGroup] = useState(null);
  const [project, setProject] = useState(null);
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [supervisorRequests, setSupervisorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchFYPData();
  }, []);

  const fetchFYPData = async () => {
    try {
      const [groupRes, partnerRes, supervisorRes] = await Promise.all([
        getStudentFYPGroup().catch(() => ({ data: { message: "No group" } })),
        getPendingPartnerRequests().catch(() => ({ data: { requests: [] } })),
        getPendingSupervisorRequests().catch(() => ({
          data: { requests: [] },
        })),
      ]);

      if (groupRes.data.group) {
        setGroup(groupRes.data.group);
        setProject(groupRes.data.project);
      }
      setPartnerRequests(partnerRes.data.requests || []);
      setSupervisorRequests(supervisorRes.data.requests || []);
    } catch (error) {
      console.error("Error fetching FYP data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPartnerRequest = async (requestId) => {
    try {
      await acceptPartnerRequest(requestId);
      toast.success("Partner request accepted! Group created!");
      fetchFYPData();
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleRejectPartnerRequest = async (requestId) => {
    try {
      await rejectPartnerRequest(requestId);
      toast.success("Partner request rejected");
      fetchFYPData();
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectData.title.trim() || !projectData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await createFYPProject(projectData.title, projectData.description);
      toast.success("Project created successfully!");
      setShowProjectForm(false);
      setProjectData({ title: "", description: "" });
      fetchFYPData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleSendSupervisorRequest = async (supervisorId) => {
    try {
      await sendSupervisorRequest(supervisorId);
      toast.success("Supervisor request sent!");
      fetchFYPData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  const handleAcceptSupervisorRequest = async (requestId) => {
    try {
      await acceptSupervisorRequest(requestId);
      toast.success("Supervisor request accepted!");
      fetchFYPData();
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleRejectSupervisorRequest = async (requestId, reason) => {
    try {
      await rejectSupervisorRequest(requestId, reason);
      toast.success("Supervisor request rejected");
      fetchFYPData();
    } catch (error) {
      toast.error("Failed to reject request");
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
            <h1 className="text-3xl font-bold text-white mb-2">
              Final Year Project
            </h1>
            <p className="text-slate-400 mb-6">
              Manage your FYP group, project, and supervisor assignments
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setTab("overview")}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                tab === "overview"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Overview
            </button>
            {group && (
              <>
                <button
                  onClick={() => setTab("project")}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    tab === "project"
                      ? "bg-blue-700 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Project
                </button>
                <button
                  onClick={() => setTab("supervisor")}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    tab === "supervisor"
                      ? "bg-blue-700 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Supervisor Requests
                </button>
              </>
            )}
            <button
              onClick={() => setTab("requests")}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors relative ${
                tab === "requests"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Partner Requests
              {partnerRequests.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {partnerRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading FYP data...</p>
            </div>
          ) : tab === "overview" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {!group ? (
                  <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                    <div className="text-5xl mb-4">👥</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      No Group Yet
                    </h2>
                    <p className="text-slate-400 mb-6">
                      You need to form a group first. Send a partner request to
                      a fellow student to form a group.
                    </p>
                    <p className="text-slate-500 text-sm">
                      Once a partner accepts your request, you'll become the
                      group leader.
                    </p>
                  </div>
                ) : (
                  <>
                    <GroupMembersPanel
                      group={group}
                      isLeader={group.leaderId === user?._id}
                    />
                    {project && <ProjectCard project={project} />}
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <h3 className="text-white font-bold mb-4">Quick Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Group Status</span>
                      <span
                        className={
                          group
                            ? "text-emerald-400 font-semibold"
                            : "text-orange-400"
                        }
                      >
                        {group ? "✓ Active" : "Forming"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Project Status</span>
                      <span
                        className={
                          project
                            ? "text-emerald-400 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        {project ? project.status : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Supervisor</span>
                      <span
                        className={
                          project?.supervisorId
                            ? "text-emerald-400 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        {project?.supervisorId ? "✓ Assigned" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : tab === "project" ? (
            <div className="space-y-6">
              {project ? (
                <ProjectCard project={project} />
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
                  {showProjectForm ? (
                    <form
                      onSubmit={handleCreateProject}
                      className="space-y-4 max-w-2xl"
                    >
                      <h2 className="text-xl font-bold text-white mb-4">
                        Create FYP Project
                      </h2>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={projectData.title}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              title: e.target.value,
                            })
                          }
                          placeholder="e.g., Smart Classroom Management System"
                          className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Project Description *
                        </label>
                        <textarea
                          value={projectData.description}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe your project idea and objectives"
                          rows="6"
                          className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                          required
                        ></textarea>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Create Project
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProjectForm(false);
                            setProjectData({ title: "", description: "" });
                          }}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">📝</div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Create Your Project
                      </h3>
                      <p className="text-slate-400 mb-6">
                        As the group leader, you can now create your FYP project
                      </p>
                      <button
                        onClick={() => setShowProjectForm(true)}
                        className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Create Project
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : tab === "supervisor" ? (
            <div className="space-y-4">
              {supervisorRequests.length > 0 ? (
                supervisorRequests.map((req) => (
                  <SupervisorRequestCard
                    key={req._id}
                    request={req}
                    onAccept={() => handleAcceptSupervisorRequest(req._id)}
                    onReject={(reason) =>
                      handleRejectSupervisorRequest(req._id, reason)
                    }
                  />
                ))
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                  <p className="text-slate-400">
                    No supervisor requests sent yet
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {partnerRequests.length > 0 ? (
                partnerRequests.map((req) => (
                  <PartnerRequestCard
                    key={req._id}
                    request={req}
                    onAccept={() => handleAcceptPartnerRequest(req._id)}
                    onReject={() => handleRejectPartnerRequest(req._id)}
                  />
                ))
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                  <p className="text-slate-400">No pending partner requests</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
