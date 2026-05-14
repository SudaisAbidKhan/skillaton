import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Auth Pages
import Login from "./Pages/auth/Login.jsx";

// Student Pages
import StudentDashboard from "./Pages/student/StudentDashboard.jsx";
import StudentComplaints from "./Pages/student/StudentComplaints.jsx";
import StudentEvents from "./Pages/student/StudentEvents.jsx";
import StudentFYP from "./Pages/student/StudentFYP.jsx";
import StudentProfile from "./Pages/student/StudentProfile.jsx";

// Home Pages
import Home from "./Pages/Home";
import About from "./Pages/About";

// Placeholder Admin/Teacher pages
const AdminDashboard = () => (
  <div className="min-h-screen bg-slate-900 text-white p-6">
    <h1>Admin Dashboard - Coming Soon</h1>
  </div>
);
const TeacherDashboard = () => (
  <div className="min-h-screen bg-slate-900 text-white p-6">
    <h1>Teacher Dashboard - Coming Soon</h1>
  </div>
);

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/complaints" element={<StudentComplaints />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/fyp" element={<StudentFYP />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
