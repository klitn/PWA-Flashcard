import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services';

// Higher-order component for protected routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Higher-order component for public routes (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export { ProtectedRoute, PublicRoute };