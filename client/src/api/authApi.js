
import API from "./axios";

export const signupUser  = (data) => API.post("/auth/signup",  data);
export const loginUser   = (data) => API.post("/auth/login",   data);
export const forgotPasswordUser = (data) => API.post("/auth/forgot-password", data);
export const resetPasswordUser  = (token, data) => API.post(`/auth/reset-password/${token}`, data);