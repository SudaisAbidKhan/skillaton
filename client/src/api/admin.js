import api from "./axiosConfig.js";

// Complaint Management
export const getAllComplaints = async (filters = {}) => {
  const response = await api.get("/complaints", { params: filters });
  return response.data;
};

export const respondToComplaint = async (complaintId, adminResponse) => {
  const response = await api.put(`/complaints/${complaintId}/respond`, {
    adminResponse,
  });
  return response.data;
};

// Event Management
export const createEvent = async (eventData) => {
  const response = await api.post("/events/create", eventData);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};

export const getEventRegistrations = async (eventId) => {
  const response = await api.get(`/events/${eventId}/registrations`);
  return response.data;
};

// User Management
export const getAllUsers = async (role) => {
  const response = await api.get("/auth/users", {
    params: role ? { role } : {},
  });
  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.put(`/auth/users/${userId}/status`, { isActive });
  return response.data;
};

// Announcement Management
export const createAnnouncement = async (announcementData) => {
  const response = await api.post("/notifications/create", announcementData);
  return response.data;
};

export const deleteAnnouncement = async (announcementId) => {
  const response = await api.delete(`/notifications/${announcementId}`);
  return response.data;
};

export const getAllAnnouncements = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// FYP Management
export const getAllFYPProjects = async (filters = {}) => {
  const response = await api.get("/fyp/projects/all", { params: filters });
  return response.data;
};

export const getFYPProjectDetails = async (projectId) => {
  const response = await api.get(`/fyp/projects/${projectId}`);
  return response.data;
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const [
      complaintsRes,
      eventsRes,
      usersRes,
      fypProjectsRes,
      announcementsRes,
    ] = await Promise.all([
      getAllComplaints({ limit: 5 }),
      api.get("/events"),
      getAllUsers(),
      getAllFYPProjects({ limit: 5 }),
      getAllAnnouncements(),
    ]);

    return {
      complaints: complaintsRes.data || [],
      events: eventsRes.data?.events || [],
      users: usersRes.data || [],
      fypProjects: fypProjectsRes.data || [],
      announcements: announcementsRes.data || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      complaints: [],
      events: [],
      users: [],
      fypProjects: [],
      announcements: [],
    };
  }
};
