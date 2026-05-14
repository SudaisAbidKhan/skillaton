import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";
import LoadingSpinner from "../../Components/common/LoadingSpinner.jsx";
import Modal from "../../Components/common/Modal.jsx";
import { getAllUsers, updateUserStatus } from "../../api/admin.js";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const adminMenuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Complaints", path: "/admin/complaints", icon: "⚠️" },
    { label: "Events", path: "/admin/events", icon: "📅" },
    { label: "Users", path: "/admin/users", icon: "👥" },
    { label: "Announcements", path: "/admin/announcements", icon: "📢" },
    { label: "FYP Projects", path: "/admin/fyp", icon: "📋" },
  ];

  const roleColors = {
    admin: "bg-red-500",
    teacher: "bg-purple-500",
    student: "bg-blue-500",
  };

  const roleIcons = {
    admin: "👨‍💼",
    teacher: "👨‍🏫",
    student: "👨‍🎓",
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
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      toast.success("User status updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const filteredUsers =
    activeRole === "all" ? users : users.filter((u) => u.role === activeRole);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} onMenuClick={() => setMenuOpen(!menuOpen)} />

      <div className="flex">
        <Sidebar isOpen={menuOpen} menuItems={adminMenuItems} />

        <main className="flex-1 lg:ml-0 transition-all">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Manage Users
            </h1>
            <p className="text-slate-400 mb-6">View and manage campus users</p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-700">
              {["all", "student", "teacher", "admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    activeRole === role
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} (
                  {
                    users.filter((u) => role === "all" || u.role === role)
                      .length
                  }
                  )
                </button>
              ))}
            </div>

            {/* Users Table */}
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800 border-b border-slate-700">
                      <th className="px-6 py-3 text-left text-white font-semibold">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-white font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-white font-semibold">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-white font-semibold">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-white font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-white font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-slate-700 hover:bg-slate-800 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {roleIcons[u.role] || "👤"}
                            </span>
                            <div>
                              <p className="text-white font-semibold">
                                {u.name}
                              </p>
                              <p className="text-slate-500 text-sm">
                                {u.studentId || u._id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded text-white ${
                              roleColors[u.role] || "bg-slate-500"
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {u.department || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded ${
                              u.isActive
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setShowDetailsModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(u._id, u.isActive)
                            }
                            className={`px-3 py-1 rounded text-sm font-medium transition text-white ${
                              u.isActive
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {u.isActive ? "Disable" : "Enable"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-lg">No users found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        title={`User Details: ${selectedUser?.name}`}
        onClose={() => setShowDetailsModal(false)}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm font-semibold">Name</p>
                <p className="text-white text-lg mt-1">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold">Email</p>
                <p className="text-white text-lg mt-1">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm font-semibold">Role</p>
                <p className="text-white text-lg mt-1">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded text-white ${
                      roleColors[selectedUser.role]
                    }`}
                  >
                    {selectedUser.role.toUpperCase()}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold">Status</p>
                <p className="text-white text-lg mt-1">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded ${
                      selectedUser.isActive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-sm font-semibold">Department</p>
              <p className="text-white text-lg mt-1">
                {selectedUser.department || "Not specified"}
              </p>
            </div>

            {selectedUser.role === "student" && (
              <>
                <div>
                  <p className="text-slate-400 text-sm font-semibold">
                    Student ID
                  </p>
                  <p className="text-white text-lg mt-1">
                    {selectedUser.studentId}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-semibold">
                    Registration Number
                  </p>
                  <p className="text-white text-lg mt-1">
                    {selectedUser.registrationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-semibold">
                    Semester
                  </p>
                  <p className="text-white text-lg mt-1">
                    {selectedUser.semester}
                  </p>
                </div>
              </>
            )}

            <div>
              <p className="text-slate-400 text-sm font-semibold">Phone</p>
              <p className="text-white text-lg mt-1">
                {selectedUser.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm font-semibold">Joined On</p>
              <p className="text-white text-lg mt-1">
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
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

export default ManageUsers;
