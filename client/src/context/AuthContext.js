// Authentication Context for MealMatch
// TODO: API Integration - Replace mock authentication with real API calls

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../mockData.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('mealmatch_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // TODO: API Integration - Replace with real authentication API
  const login = async (email, password, role) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const userList = role === 'student' ? mockUsers.students : mockUsers.cooks;
    const foundUser = userList.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithRole = { ...foundUser, role };
      setUser(userWithRole);
      localStorage.setItem('mealmatch_user', JSON.stringify(userWithRole));
      setIsLoading(false);
      return { success: true, user: userWithRole };
    } else {
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // TODO: API Integration - Replace with real registration API
  const register = async (email, password, name, role) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const allUsers = [...mockUsers.students, ...mockUsers.cooks];
    const existingUser = allUsers.find(u => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: 'User already exists' };
    }
    
    // Create new user (in real app, this would be an API call)
    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      role,
      ...(role === 'student' ? { subscribedTo: null } : { cookId: null })
    };
    
    setUser(newUser);
    localStorage.setItem('mealmatch_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mealmatch_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};