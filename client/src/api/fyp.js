import api from "./axiosConfig.js";

// Partner Request APIs
export const sendPartnerRequest = async (toStudentId, message) => {
  return await api.post("/fyp/partner-request/send", { toStudentId, message });
};

export const getPendingPartnerRequests = async () => {
  return await api.get("/fyp/partner-request/pending");
};

export const acceptPartnerRequest = async (requestId) => {
  return await api.post("/fyp/partner-request/accept", { requestId });
};

export const rejectPartnerRequest = async (requestId) => {
  return await api.post("/fyp/partner-request/reject", { requestId });
};

// FYP Group APIs
export const getStudentFYPGroup = async () => {
  return await api.get("/fyp/my-group");
};

export const createFYPProject = async (title, description) => {
  return await api.post("/fyp/project/create", { title, description });
};

// Supervisor Request APIs
export const sendSupervisorRequest = async (supervisorId) => {
  return await api.post("/fyp/supervisor-request/send", { supervisorId });
};

export const getPendingSupervisorRequests = async () => {
  return await api.get("/fyp/supervisor-request/pending");
};

export const acceptSupervisorRequest = async (requestId) => {
  return await api.post("/fyp/supervisor-request/accept", { requestId });
};

export const rejectSupervisorRequest = async (requestId, reason) => {
  return await api.post("/fyp/supervisor-request/reject", {
    requestId,
    reason,
  });
};
