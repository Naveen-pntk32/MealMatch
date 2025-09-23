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
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = "http://localhost:3000";

  // ✅ Get current user from API (session cookie)
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/register/user`, {
        method: "GET",
        credentials: "include", // send cookies
      });

      if (res.ok) {
        const data = await res.json();
        setUser("student");
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ On app load → check if user is logged in
  useEffect(() => {
    fetchCurrentUser();
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

      setUser(data); // server returns created user
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
        credentials: "include", // important for cookie-based auth
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }

      // After login, fetch the logged-in user details
      await fetchCurrentUser();

      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout user
  const logout = () => {
    setUser(null);
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
