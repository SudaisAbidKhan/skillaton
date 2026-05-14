import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserProfile, updateProfile } from "../../api/users.js";
import Navbar from "../../Components/common/Navbar.jsx";
import Sidebar from "../../Components/common/Sidebar.jsx";

export default function StudentProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      setFormData(res.data.user);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
      });
      if (res.data.success) {
        toast.success("Profile updated successfully");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/student/dashboard", icon: "🏠" },
    { label: "Complaints", path: "/student/complaints", icon: "📋" },
    { label: "Events", path: "/student/events", icon: "📅" },
    { label: "FYP", path: "/student/fyp", icon: "📚" },
    { label: "Profile", path: "/student/profile", icon: "👤" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} menuItems={menuItems} />
          <main className="flex-1 p-6">
            <p className="text-slate-400">Loading profile...</p>
          </main>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
              <p className="text-slate-400">Manage your account settings</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Card */}
          <div className="max-w-2xl">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              {/* Profile Header */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {formData.name}
                  </h2>
                  <p className="text-slate-400">{formData.role}</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full bg-slate-900 border border-slate-600 text-slate-500 rounded-lg px-4 py-2.5 text-sm opacity-50 cursor-not-allowed"
                      />
                      <p className="text-slate-500 text-xs mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="03XX-XXXXXXX"
                        className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="e.g., CS, SE, ENG"
                        className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Account Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {formData.studentId && (
                        <div>
                          <p className="text-slate-400 text-sm">Student ID</p>
                          <p className="text-white font-semibold">
                            {formData.studentId}
                          </p>
                        </div>
                      )}
                      {formData.registrationNumber && (
                        <div>
                          <p className="text-slate-400 text-sm">
                            Registration Number
                          </p>
                          <p className="text-white font-semibold">
                            {formData.registrationNumber}
                          </p>
                        </div>
                      )}
                      {formData.semester && (
                        <div>
                          <p className="text-slate-400 text-sm">Semester</p>
                          <p className="text-white font-semibold">
                            {formData.semester}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm">Account Created</p>
                      <p className="text-white font-semibold">
                        {new Date(formData.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isEditing && (
                  <div className="flex gap-3 pt-6 border-t border-slate-700">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile();
                      }}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
