import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { ShieldCheck, AlertCircle, Eye, EyeOff, Lock, User } from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password change state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changePwError, setChangePwError] = useState('');
  const [changePwLoading, setChangePwLoading] = useState(false);

  const { login, changePassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(identifier, password);

    if (result.success) {
      const stored = localStorage.getItem('clubpass_user');
      const user = stored ? JSON.parse(stored) : null;

      if (result.must_change_password && user?.role !== 'student') {
        setShowChangePassword(true);
        setCurrentPw(password);
        setIsLoading(false);
        return;
      }

      if (user) {
        if (user.role === 'super_admin') navigate('/admin');
        else if (user.role === 'admin') navigate('/monitoring');
        else if (user.role === 'hod') navigate('/hod');
        else if (user.role === 'poc') navigate('/poc');
        else if (user.role === 'coordinator') navigate('/coordinator');
        else if (user.role === 'student') navigate('/student');
        else navigate('/');
      }
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwError('');

    if (newPw !== confirmPw) {
      setChangePwError('Passwords do not match');
      return;
    }
    if (newPw.length < 12) {
      setChangePwError('Password must be at least 12 characters');
      return;
    }

    setChangePwLoading(true);
    const result = await changePassword(currentPw, newPw);

    if (result.success) {
      const stored = localStorage.getItem('clubpass_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.role === 'student') navigate('/student');
        else navigate('/');
      }
    } else {
      setChangePwError(result.error || 'Failed to change password');
    }
    setChangePwLoading(false);
  };

  useEffect(() => {
    // If already logged in, redirect
    const stored = localStorage.getItem('clubpass_user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.role === 'super_admin') navigate('/admin');
      else if (u.role === 'admin') navigate('/monitoring');
      else if (u.role === 'hod') navigate('/hod');
      else if (u.role === 'poc') navigate('/poc');
      else if (u.role === 'coordinator') navigate('/coordinator');
      else if (u.role === 'student') navigate('/student');
    }
  }, [navigate]);

  // Forced password change screen
  if (showChangePassword) {
    return (
      <div className="min-h-screen bg-[var(--ia-bg)] flex items-center justify-center p-4">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-amber-500/10 mb-3">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-lg font-semibold text-[var(--ia-text)]">Change Password Required</h1>
            <p className="text-[var(--ia-text-muted)] mt-1 text-sm">You must set a new password before continuing.</p>
          </div>
          <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-6">
            {changePwError && (
              <div className="mb-4 p-2.5 rounded-md bg-red-500/8 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {changePwError}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--ia-text-secondary)]">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 12 characters"
                  required
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--ia-text-secondary)]">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  required
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors"
                />
              </div>
              <div className="text-xs text-[var(--ia-text-muted)] space-y-0.5">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-1">
                  <li>At least 12 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                </ul>
              </div>
              <button
                type="submit"
                disabled={changePwLoading}
                className="w-full py-2 px-4 rounded-md bg-[var(--ia-accent)] hover:bg-[var(--ia-accent-hover)] text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--ia-accent)]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {changePwLoading ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-[var(--ia-text-muted)] mt-5">Infin8 Access v1.2</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ia-bg)] flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--ia-accent)]/10 mb-3">
            <ShieldCheck className="w-5 h-5 text-[var(--ia-accent)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--ia-text)] tracking-tight">Infin8 Access</h1>
          <p className="text-[var(--ia-text-muted)] mt-1 text-sm">Club Management & Permission System</p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-6">
          <h2 className="text-sm font-semibold text-[var(--ia-text)] mb-5">Sign in to your account</h2>

          {error && (
            <div className="mb-4 p-2.5 rounded-md bg-red-500/8 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="text-xs font-medium text-[var(--ia-text-secondary)]">Email or Roll Number</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ia-text-muted)]" />
                <input
                  id="identifier"
                  type="text"
                  placeholder="you@example.com or 22R11A0501"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-[var(--ia-text-secondary)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ia-text-muted)]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ia-text-muted)] hover:text-[var(--ia-text-secondary)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-[var(--ia-accent)] hover:bg-[var(--ia-accent-hover)] text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--ia-accent)]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--ia-text-muted)] mt-5">
          Malla Reddy Technical Campus &middot; Infin8 Access v1.2
        </p>
      </div>
    </div>
  );
}
