import { Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./Pages/auth/Login.jsx";

// Student Pages
import StudentDashboard from "./Pages/student/StudentDashboard.jsx";
import StudentComplaints from "./Pages/student/StudentComplaints.jsx";
import StudentEvents from "./Pages/student/StudentEvents.jsx";
import StudentFYP from "./Pages/student/StudentFYP.jsx";
import StudentProfile from "./Pages/student/StudentProfile.jsx";

// Admin Pages
import AdminDashboard from "./Pages/admin/AdminDashboard.jsx";
import ManageComplaints from "./Pages/admin/ManageComplaints.jsx";
import ManageEvents from "./Pages/admin/ManageEvents.jsx";
import ManageUsers from "./Pages/admin/ManageUsers.jsx";
import Announcements from "./Pages/admin/Announcements.jsx";
import ManageFYP from "./Pages/admin/ManageFYP.jsx";

// Placeholder Teacher page
const TeacherDashboard = () => (
  <div className="min-h-screen bg-slate-900 text-white p-6">
    <h1>Teacher Dashboard - Coming Soon</h1>
  </div>
);

function App() {
  return (
    <div>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/complaints" element={<StudentComplaints />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/fyp" element={<StudentFYP />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/complaints" element={<ManageComplaints />} />
        <Route path="/admin/events" element={<ManageEvents />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/fyp" element={<ManageFYP />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
