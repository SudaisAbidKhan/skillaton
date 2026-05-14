import api from "./axiosConfig.js";

export const submitComplaint = async (complaintData) => {
  return await api.post("/complaints/submit", complaintData);
};

export const getStudentComplaints = async () => {
  return await api.get("/complaints/my-complaints");
};

export const deleteComplaint = async (id) => {
  return await api.delete(`/complaints/${id}`);
};

export const getComplaintById = async (id) => {
  return await api.get(`/complaints/${id}`);
};
