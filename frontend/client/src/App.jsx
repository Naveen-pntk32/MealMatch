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
                
                {/* Protected Routes */}
                <Route 
                  // path="/student/dashboard" 
                  element={
                    <ProtectedRoute role="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  // path="/cook/dashboard" 
                  element={
                    <ProtectedRoute role="cook">
                      <CookDashboard  />
                    </ProtectedRoute>
                  } 
                />
                <Route path='/student/dashboard' element={<StudentDashboard role="student"/>} />
                <Route path='/cook/dashboard' element={<CookDashboard role="cook"/>} />
                
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