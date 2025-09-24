import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Route Guards
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

// Pages
import Dashboard from '../pages/Dashboard';
import DeckDetail from '../pages/DeckDetail';
import Study from '../pages/Study';
import CreateDeck from '../pages/CreateDeck';
import EditDeck from '../pages/EditDeck';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

const router = createBrowserRouter([
  // Root route - redirect to dashboard or login
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  
  // Protected routes with MainLayout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'deck/:id',
        element: <DeckDetail />
      },
      {
        path: 'study/:id',
        element: <Study />
      },
      {
        path: 'create-deck',
        element: <CreateDeck />
      },
      {
        path: 'edit-deck/:id',
        element: <EditDeck />
      }
    ]
  },
  
  // Public routes with AuthLayout
  {
    path: '/',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  },
  
  // 404 Not Found
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-xl text-gray-600 mb-4">Trang không tìm thấy</p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    )
  }
]);

export default router;