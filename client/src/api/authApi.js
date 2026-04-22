
import API from "./axios";

// signup
export const signupUser = (data) => API.post("/auth/signup", data);

// login
export const loginUser = (data) => API.post("/auth/login", data);