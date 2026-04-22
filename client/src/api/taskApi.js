
import API from "./axios";

export const getTasks = (status) =>
  API.get(`/tasks${status ? `?status=${status}` : ""}`);

export const createTask = (data) => API.post("/tasks", data);

export const updateTask = (id, data) =>
  API.put(`/tasks/${id}`, data);

export const deleteTask = (id) =>
  API.delete(`/tasks/${id}`);
