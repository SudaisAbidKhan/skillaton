import api from "./axiosConfig.js";

export const getAllEvents = async (status) => {
  return await api.get("/events/", { params: { status } });
};

export const getEventById = async (id) => {
  return await api.get(`/events/${id}`);
};

export const registerForEvent = async (eventId) => {
  return await api.post("/events/register", { eventId });
};

export const getStudentEventRegistrations = async () => {
  return await api.get("/events/my-registrations");
};

export const cancelEventRegistration = async (id) => {
  return await api.delete(`/events/registration/${id}`);
};
