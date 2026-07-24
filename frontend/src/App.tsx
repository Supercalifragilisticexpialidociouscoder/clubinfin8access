import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { requestNotificationPermission } from './utils/notifications';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from './components/Toast';
import { useDeviceNotifications } from './hooks/useDeviceNotifications';
import Login from './pages/Login';
import VerifyMember from './pages/VerifyMember';
import HODDashboard from './pages/HODDashboard';
import POCDashboard from './pages/POCDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InstitutionAdminDashboard from './pages/InstitutionAdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { Search } from 'lucide-react';

function DeviceNotificationManager() {
  useDeviceNotifications();
  return null;
}

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { registerServiceWorkerAndSubscribe } from './utils/webPush';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading, apiFetch } = useAuth();
  const [pushStatus, setPushStatus] = useState<string>(Notification.permission);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // If permission is already granted, make sure we subscribe and send to backend
    if (user && Notification.permission === 'granted') {
      handleSubscribe();
    }
  }, [user]);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        setPushStatus(perm);
        if (perm !== 'granted') return;
      }
      
      const sub = await registerServiceWorkerAndSubscribe();
      if (sub) {
        await apiFetch('/api/notifications/subscribe', {
          method: 'POST',
          body: JSON.stringify({ subscription: sub }),
        });
      }
    } catch (e) {
      console.error('Failed to subscribe to push', e);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dark min-h-screen gradient-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as string)) {
    return <Navigate to="/login" replace />;
  }

  if (pushStatus !== 'granted') {
    return (
      <div className="dark min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-[var(--ia-text)] mb-2">Enable Notifications</h1>
          <p className="text-[var(--ia-text-secondary)] text-sm mb-6">
            Push notifications are mandatory to use INFIN8 Access so you never miss important updates and approvals.
          </p>
          {pushStatus === 'denied' ? (
            <p className="text-red-400 text-sm mb-6">
              You have blocked notifications. Please enable them in your browser settings and refresh.
            </p>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isSubscribing ? 'Enabling...' : 'Enable Notifications'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="dark min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-xl font-bold text-[var(--ia-text)] mb-2">Page Not Found</h1>
        <p className="text-[var(--ia-text-secondary)] text-sm mb-4">The page you are looking for does not exist.</p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors text-sm font-medium"
        >
          Go to Login
        </a>
        <p className="text-xs text-[var(--ia-text-muted)] mt-6">Infin8 Access v1.2</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Public verification route — QR codes point here */}
      <Route path="/verify/:uuid" element={<VerifyMember />} />

      {/* Legacy route support */}
      <Route path="/member/:id" element={<VerifyMember />} />

      {/* Protected Role-Based Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitoring/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <InstitutionAdminDashboard />
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
      <Route
        path="/poc/*"
        element={
          <ProtectedRoute allowedRoles={['poc']}>
            <POCDashboard />
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
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <DeviceNotificationManager />
        <HashRouter>
          <ToastContainer />
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
