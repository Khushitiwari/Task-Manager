
import { useState } from "react";
import { loginUser, signupUser } from "../api/authApi";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      localStorage.setItem("token", res.data.token);
      return true;
    } catch (err) {
      console.log(err.response?.data?.msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    try {
      setLoading(true);
      await signupUser(data);
      return true;
    } catch (err) {
      console.log(err.response?.data?.msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return { login, register, logout, loading };
};