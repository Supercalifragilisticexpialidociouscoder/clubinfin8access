import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

type UserRole = 'super_admin' | 'coordinator' | 'hod' | 'student' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  club_id?: string;
  club_name?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  mustChangePassword: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; must_change_password?: boolean }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  clearMustChangePassword: () => void;
  isLoading: boolean;
  apiCall: (path: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('clubpass_token');
    const storedUser = localStorage.getItem('clubpass_user');
    const storedMustChange = localStorage.getItem('clubpass_must_change');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedMustChange === 'true') setMustChangePassword(true);
      } catch {
        localStorage.removeItem('clubpass_token');
        localStorage.removeItem('clubpass_user');
        localStorage.removeItem('clubpass_must_change');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string; must_change_password?: boolean }> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('clubpass_token', data.token);
      localStorage.setItem('clubpass_user', JSON.stringify(data.user));

      if (data.must_change_password) {
        setMustChangePassword(true);
        localStorage.setItem('clubpass_must_change', 'true');
      }

      return { success: true, must_change_password: data.must_change_password };
    } catch (err: any) {
      return { success: false, error: 'Network error. Is the backend running?' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMustChangePassword(false);
    localStorage.removeItem('clubpass_token');
    localStorage.removeItem('clubpass_user');
    localStorage.removeItem('clubpass_must_change');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to change password' };
      }

      setMustChangePassword(false);
      localStorage.removeItem('clubpass_must_change');
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const clearMustChangePassword = () => {
    setMustChangePassword(false);
    localStorage.removeItem('clubpass_must_change');
  };

  const apiCall = async (path: string, options: RequestInit = {}): Promise<Response> => {
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE}${path}`, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, token, mustChangePassword, login, logout, changePassword, clearMustChangePassword, isLoading, apiCall }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { API_BASE };
