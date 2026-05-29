import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token to every request if it exists
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("taskflow_user");
  if (stored) {
    const user = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

// Task endpoints
export const getTasks = () => api.get("/tasks");
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
