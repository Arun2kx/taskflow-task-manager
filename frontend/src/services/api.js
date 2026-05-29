import axios from "axios";

const API = axios.create({
  baseURL: "https://taskflow-task-manager-rlto.onrender.com/api",
});

export default API;

// Attach token to every request if it exists
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("taskflow_user");
  if (stored) {
    const user = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);

export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
