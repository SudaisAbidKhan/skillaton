import api from "./axiosConfig.js";

export const getAnnouncements = async (role = "student") => {
  return await api.get("/notifications/", { params: { role } });
};

export const markAsRead = async (notificationId) => {
  return await api.post("/notifications/mark-read", { notificationId });
};

export const getUnreadCount = async () => {
  return await api.get("/notifications/unread-count");
};
