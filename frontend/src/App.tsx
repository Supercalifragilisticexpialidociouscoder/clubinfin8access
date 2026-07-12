import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';

import MemberVerification from './pages/MemberVerification';
import HODDashboard from './pages/HODDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';

// Placeholder components for roles
const SuperAdminDashboard = () => <div className="p-4">Super Admin Dashboard (Pending)</div>;

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as string)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Role-Based Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/coordinator/*" 
        element={
          <ProtectedRoute allowedRoles={['coordinator']}>
            <CoordinatorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hod/*" 
        element={
          <ProtectedRoute allowedRoles={['hod']}>
            <HODDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Public / HOD Verifiable route */}
      <Route path="/member/:id" element={<MemberVerification />} />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
