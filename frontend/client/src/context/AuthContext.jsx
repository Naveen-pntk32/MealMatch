// @refresh reset
// Authentication Context for MealMatch
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

  // ✅ Get current user from API (session cookie)
  const fetchCurrentUser = async (uid) => {
    try {
      if (!uid) return null;
      const res = await fetch(`${BASE_URL}/api/register/user/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return data;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
      return null;
    }
  };

  // ✅ On app load → check if user is logged in
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      fetchCurrentUser(uid);
    }
  }, []);

  // ✅ Register user
  const register = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // setUser(data); // server returns created user
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Login user
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }
      const userData = await res.json();
      if (!userData._id) {
        throw new Error("Invalid user data received from server");
      }
      localStorage.setItem("uid", userData._id);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout user
  const logout = () => {
    setUser(null);
      localStorage.removeItem("uid");      

    // Optionally call backend: fetch(`${BASE_URL}/api/logout`, { method: "POST", credentials: "include" });
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
