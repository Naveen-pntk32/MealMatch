// Main App component for MealMatch
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CookProfilePage from './pages/CookProfilePage';
import StudentDashboard from './pages/StudentDashboard';
import CookDashboard from './pages/CookDashboard';
import NotFound from './pages/not-found';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cook/:id" element={<CookProfilePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Protected Routes */}
                {/* Unprotected for SPA parity with Wouter routes */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/cook/dashboard" element={<CookDashboard />} />
                
                {/* 404 Route */}

                <Route path="*" element={<NotFound />} />
                      
              </Routes>
            </div>
            <Toaster />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;