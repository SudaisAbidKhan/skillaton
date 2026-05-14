import api from "./axiosConfig.js";

export const getUserProfile = async () => {
  return await api.get("/auth/profile");
};

export const updateProfile = async (userData) => {
  return await api.put("/auth/profile", userData);
};

export const logout = async () => {
  return await api.post("/auth/logout");
};
