import { formatYear } from '../utils/formatters';
import { useEffect, useState } from 'react';
import ISTTime from '../components/ISTTime';
import { PermissionTimer, formatISTTime } from '../components/ActiveTimer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import { ThemeToggle } from '../components/ThemeToggle';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import AttendanceReportForm from '../components/AttendanceReportForm';
import NotificationComposer from '../components/NotificationComposer';

import QRCode from 'qrcode';
import {
  Users, QrCode, LogOut, CheckCircle2, XCircle, Search,
  ChevronLeft, ChevronRight, User, Shield, ExternalLink,
  Download, Printer, Maximize2, LayoutDashboard, Play,
  ClipboardList, Bell, ScrollText, Clock
} from 'lucide-react';

export default function CoordinatorDashboard() {
const checkExpired = (p: any) => {
  if (p.status !== 'granted' || p.completed_at) return false;
  const currentIST = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  
  if (currentIST >= '16:00') return true;
  if (p.expected_return_time && currentIST >= p.expected_return_time) return true;
  return false;
};

  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'members' | 'qr' | 'active' | 'completed' | 'history' | 'notifications' | 'reports'>('members');
  
  // Data states
  const [members, setMembers] = useState<any[]>([]);
  const [activePermissions, setActivePermissions] = useState<any[]>([]);
  const [completedPermissions, setCompletedPermissions] = useState<any[]>([]);
  const [historyPermissions, setHistoryPermissions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalHistory, setTotalHistory] = useState(0);
  const [page, setPage] = useState(1);
  const [filterDate, setFilterDate] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showFullscreenQR, setShowFullscreenQR] = useState(false);

  // Mark complete confirmation state
  const [confirmCompleteId, setConfirmCompleteId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  // Initialization
  const [facultyCoordinators, setFacultyCoordinators] = useState<any[]>([]);

  useEffect(() => {
    loadSettings();
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    if (!user?.club_id) return;
    try {
      const res = await apiCall(`/api/coordinator/faculty?club_id=${user.club_id}`);
      if (res.ok) {
        const data = await res.json();
        setFacultyCoordinators(data.faculty || []);
      }
    } catch { }
  };

  // Live polling
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const handleVisibility = () => {
      if (document.hidden) clearInterval(interval);
      else interval = setInterval(pollData, 5000);
    };
    
    interval = setInterval(pollData, 5000);
    document.addEventListener('visibilitychange', handleVisibility);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [activeTab, page, filterDate, searchQuery]);

  useEffect(() => {
    pollData();
  }, [activeTab, page, filterDate, searchQuery]);

  const pollData = () => {
    if (activeTab === 'members') loadMembers();
    if (activeTab === 'active') loadActive();
    if (activeTab === 'completed') loadCompleted();
    if (activeTab === 'history') loadHistory();
    if (activeTab === 'notifications') loadNotifications();
  };

  const loadSettings = async () => {
    try {
      const res = await apiCall('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || {});
      }
    } catch { }
  };

  const loadMembers = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '30', member_type: 'student' });
      if (searchQuery) p.set('search', searchQuery);
      if (user?.club_name) p.set('club', user.club_name);
      const res = await apiCall(`/api/members?${p}`);
      if (res.ok) {
        const d = await res.json();
        setMembers(d.members || []);
        setTotalMembers(d.total || 0);
      }
    } catch { }
  };

  const loadActive = async () => {
    try {
      const p = new URLSearchParams({ page: '1', limit: '50', status: 'granted' });
      if (user?.club_name) p.set('club', user.club_name);
      const res = await apiCall(`/api/permissions?${p}`);
      if (res.ok) {
        const d = await res.json();
        setActivePermissions(d.permissions || []);
      }
    } catch { }
  };

  const loadCompleted = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '50', status: 'completed' });
      if (user?.club_name) p.set('club', user.club_name);
      if (filterDate) p.set('date', filterDate);
      const res = await apiCall(`/api/permissions?${p}`);
      if (res.ok) {
        const d = await res.json();
        setCompletedPermissions(d.permissions || []);
      }
    } catch { }
  };

  const loadHistory = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '30' });
      if (user?.club_name) p.set('club', user.club_name);
      if (filterDate) p.set('date', filterDate);
      const res = await apiCall(`/api/permissions?${p}`);
      if (res.ok) {
        const d = await res.json();
        setHistoryPermissions(d.permissions || []);
        setTotalHistory(d.total || 0);
      }
    } catch { }
  };

  const loadNotifications = async () => {
    try {
      const res = await apiCall('/api/notifications');
      if (res.ok) {
        const d = await res.json();
        setNotifications(d.notifications || []);
      }
    } catch { }
  };

  const markAllRead = async () => {
    await apiCall('/api/notifications/read-all', { method: 'PATCH' });
    loadNotifications();
  };

  const handleMarkCompleted = async () => {
    if (!confirmCompleteId) return;
    setCompleting(true);
    try {
      const res = await apiCall(`/api/permissions/${confirmCompleteId}/complete`, { method: 'POST' });
      if (res.ok) {
        toast('success', 'Permission marked as completed');
        loadActive(); // refresh instantly
      } else {
        const data = await res.json();
        toast('error', data.error || 'Failed to complete permission');
      }
    } catch {
      toast('error', 'Network error');
    }
    setCompleting(false);
    setConfirmCompleteId(null);
  };

  // QR Logic
  const generateQR = async (member: any) => {
    setSelectedMember(member);
    const prefix = settings.qr_url_prefix || 'https://clubpass.pages.dev/verify/';
    const url = `${prefix}${member.uuid}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
    setQrDataUrl(dataUrl);
    setActiveTab('qr');
  };

  const downloadQR = () => {
    if (!qrDataUrl || !selectedMember) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Infin8Access-${selectedMember.roll_number}-QR.png`;
    a.click();
    toast('success', 'QR code downloaded.');
  };

  const printQR = () => {
    if (!qrDataUrl || !selectedMember) return;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<html><body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;font-family:sans-serif;">
        <div style="text-align:center;">
          <h2>${selectedMember.full_name}</h2>
          <p>${selectedMember.roll_number} | ${selectedMember.member_id}</p>
          <img src="${qrDataUrl}" style="width:300px;height:300px;" />
          <p style="font-size:12px;color:#666;">Infin8 Access v1.2</p>
        </div>
      </body></html>`);
      w.document.close();
      w.print();
    }
  };

  const calculateOverdue = (expectedTime: string) => {
    if (!expectedTime) return 0;
    const nowIST = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false, hour: 'numeric', minute: 'numeric' });
    const [nowH, nowM] = nowIST.split(':').map(Number);
    const [expH, expM] = expectedTime.split(':').map(Number);
    const nowMins = nowH * 60 + nowM;
    const expMins = expH * 60 + expM;
    const overdueMins = nowMins - expMins;
    return overdueMins > 0 ? overdueMins : 0;
  };

  return (
    <div className="min-h-screen bg-[var(--ia-bg)] flex flex-col">
      {/* Fullscreen QR overlay */}
      {showFullscreenQR && qrDataUrl && (
        <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowFullscreenQR(false)}>
          <div className="text-center animate-scale-in">
            <img src={qrDataUrl} alt="QR Code" className="w-72 h-72 sm:w-96 sm:h-96 rounded-lg shadow-2xl mx-auto bg-white p-4" />
            <p className="text-white font-semibold text-lg mt-6">{selectedMember?.full_name}</p>
            <p className="text-[var(--ia-text-muted)] text-sm">{selectedMember?.roll_number} | {selectedMember?.member_id}</p>
            <p className="text-[var(--ia-text-secondary)] text-xs mt-4">Tap anywhere to close</p>
          </div>
        </div>
      )}

      {/* Complete Confirmation */}
      <ConfirmDialog
        open={!!confirmCompleteId}
        title="Mark as Completed?"
        message="This will move the student from 'Currently Outside' to 'Completed'. They have finished their task."
        confirmLabel="Mark Completed"
        cancelLabel="Cancel"
        variant="primary"
        onConfirm={handleMarkCompleted}
        onCancel={() => setConfirmCompleteId(null)}
        isLoading={completing}
      />

      {/* Header */}
      <header className="bg-[var(--ia-surface)] border-b border-[var(--ia-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--ia-accent)]/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[var(--ia-accent)]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[var(--ia-text)]">Infin8 Access</h1>
              <p className="text-[11px] text-[var(--ia-text-muted)] font-medium uppercase tracking-wider">Faculty Coordinator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ISTTime />
            </div>
            <div className="hidden sm:block h-5 w-px bg-[var(--ia-border)]" />
            <ThemeToggle />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-[var(--ia-text)]">{user?.name}</p>
              <p className="text-[11px] text-[var(--ia-text-muted)]">{user?.club_name}</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="px-2.5 py-1.5 rounded-md bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] text-xs transition-colors flex items-center gap-1.5" aria-label="Logout">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 flex-1 w-full">
        {facultyCoordinators.length > 0 && (
          <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-3 flex flex-wrap gap-4 items-center">
            <span className="text-xs font-semibold text-[var(--ia-text-muted)] uppercase tracking-wide">Assigned Faculty Coordinators:</span>
            {facultyCoordinators.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm font-medium text-[var(--ia-text)]">
                <Shield className="w-3.5 h-3.5 text-[var(--ia-accent)] opacity-70" />
                <span>{f.full_name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-[var(--ia-border)] overflow-x-auto">
          {[
            { id: 'members', label: 'Members', icon: Users },
            { id: 'active', label: 'Active', icon: Play },
            { id: 'completed', label: 'Completed', icon: CheckCircle2 },
            { id: 'history', label: 'History Logs', icon: Clock },
            { id: 'reports', label: 'Reports', icon: ScrollText },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'qr', label: 'QR', icon: QrCode },
          ].map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id as any); setPage(1); }} className={`flex items-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === t.id ? 'border-[var(--ia-accent)] text-[var(--ia-accent)]' : 'border-transparent text-[var(--ia-text-muted)] hover:text-[var(--ia-text-secondary)]'}`}>
              <t.icon className="w-3.5 h-3.5" /> <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-3 animate-fade-in">
            <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setPage(1); }} placeholder="Search by student name or roll number..." />
            <p className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">{totalMembers} members found in {user?.club_name}</p>

            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]">
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Student</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--ia-border)]">
                    {members.map((m: any) => (
                      <tr key={m.id} className="hover:bg-[var(--ia-elevated)] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-[var(--ia-accent)]/12 flex items-center justify-center text-xs font-semibold text-[var(--ia-accent)]">{m.full_name?.charAt(0)}</div>
                            <div><p className="text-[var(--ia-text)] font-medium text-sm">{m.full_name}</p><p className="text-[11px] text-[var(--ia-text-muted)]">{m.roll_number} &middot; {m.department} &middot; {formatYear(m.year)} &middot; {m.section}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded font-medium ${m.status === 'active' ? 'status-active' : m.status === 'suspended' ? 'status-inactive' : 'bg-[var(--ia-completed)]/10 text-[var(--ia-completed)] border border-[var(--ia-completed)]/15'}`}>{m.status || 'active'}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => navigate(`/verify/${m.uuid}`)} title="View Profile" className="p-1.5 rounded text-[var(--ia-text-muted)] hover:bg-[var(--ia-border)] hover:text-[var(--ia-text)] transition-colors"><ExternalLink className="w-3.5 h-3.5" /></button>
                            <button onClick={() => generateQR(m)} title="View QR" className="p-1.5 rounded text-[var(--ia-accent)] hover:bg-[var(--ia-accent)]/15 transition-colors"><QrCode className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {members.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-[var(--ia-text-muted)] text-sm">No members found.</td></tr>}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} total={totalMembers} />
            </div>
          </div>
        )}

        {/* Active Permissions Tab */}
        {activeTab === 'active' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden border-t-2 border-t-[var(--ia-info)] shadow-sm">
              <div className="px-4 py-3 border-b border-[var(--ia-border)] bg-[var(--ia-elevated)] flex items-center gap-2">
                <Play className="w-4 h-4 text-[var(--ia-info)]" />
                <h3 className="font-semibold text-sm text-[var(--ia-text)]">Currently Outside</h3>
              </div>
              <div className="divide-y divide-[var(--ia-border)]">
                {activePermissions.map(p => {
                  const overdue = calculateOverdue(p.expected_return_time);
                  return (
                    <div key={p.id} className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--ia-elevated)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[var(--ia-info)]/15 flex items-center justify-center text-[var(--ia-info)] font-semibold text-xs">{p.member_name?.charAt(0)}</div>
                        <div>
                          <p className="text-[var(--ia-text)] font-medium text-sm">{p.member_name}</p>
                          <p className="text-[11px] text-[var(--ia-text-muted)] font-mono">{p.roll_number} &middot; {p.department} &middot; {formatYear(p.year)} &middot; {p.section}</p>
                          <p className="text-xs text-[var(--ia-text-secondary)] mt-0.5">Purpose: {p.purpose} &middot; Appr: {p.hod_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div><p className="text-[10px] text-[var(--ia-text-muted)] uppercase tracking-wide">Departure</p><p className="text-xs text-[var(--ia-text)] font-medium">{p.approved_at ? formatISTTime(p.approved_at) : p.time}</p></div>
                        {p.expected_return_time && (
                          <div><p className="text-[10px] text-[var(--ia-text-muted)] uppercase tracking-wide">Expected</p><p className="text-xs text-[var(--ia-text)] font-medium">{p.expected_return_time}</p></div>
                        )}
                        {overdue > 0 && (
                          <div className="px-2 py-1 rounded bg-[var(--ia-danger)]/15 border border-[var(--ia-danger)]/25 text-[var(--ia-danger)] text-[10px] font-bold">OVERDUE {overdue}m</div>
                        )}
                        <button onClick={() => setConfirmCompleteId(p.id)} className="ml-2 px-3 py-1.5 rounded-md bg-[var(--ia-info)] hover:bg-blue-600 text-white font-medium text-xs flex items-center gap-1.5 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      </div>
                    </div>
                  );
                })}
                {activePermissions.length === 0 && <p className="px-4 py-8 text-center text-[var(--ia-text-muted)] text-sm">No active permissions found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Completed Permissions Tab */}
        {activeTab === 'completed' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2"><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]" /></div>
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden border-t-2 border-t-[var(--ia-success)] shadow-sm">
              <div className="px-4 py-3 border-b border-[var(--ia-border)] bg-[var(--ia-elevated)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--ia-success)]" />
                <h3 className="font-semibold text-sm text-[var(--ia-text)]">Completed Sessions</h3>
              </div>
              <div className="divide-y divide-[var(--ia-border)]">
                {completedPermissions.map(p => (
                  <div key={p.id} className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--ia-elevated)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[var(--ia-success)]/15 flex items-center justify-center text-[var(--ia-success)] font-semibold text-xs">{p.member_name?.charAt(0)}</div>
                      <div>
                        <p className="text-[var(--ia-text)] font-medium text-sm">{p.member_name}</p>
                        <p className="text-[11px] text-[var(--ia-text-muted)] font-mono">{p.roll_number} &middot; {p.department} &middot; {formatYear(p.year)} &middot; {p.section}</p>
                        <p className="text-xs text-[var(--ia-text-secondary)] mt-0.5">Purpose: {p.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 text-right">
                      <div><p className="text-[10px] text-[var(--ia-text-muted)] uppercase tracking-wide">Departure</p><p className="text-xs text-[var(--ia-text)] font-medium">{p.approved_at ? formatISTTime(p.approved_at) : p.time}</p></div>
                      <div><p className="text-[10px] text-[var(--ia-text-muted)] uppercase tracking-wide">Completed At</p><p className="text-xs text-[var(--ia-success)] font-medium">{formatISTTime(p.completed_at)}</p></div>
                      <div><p className="text-[10px] text-[var(--ia-text-muted)] uppercase tracking-wide">Duration</p><p className="text-xs text-[var(--ia-text)] font-medium"><PermissionTimer permission={p} /></p></div>
                    </div>
                  </div>
                ))}
                {completedPermissions.length === 0 && <p className="px-4 py-8 text-center text-[var(--ia-text-muted)] text-sm">No completed permissions found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2"><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]" /></div>
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]"><th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Student</th><th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Date/Time</th><th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Details</th><th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Status</th></tr></thead>
                  <tbody className="divide-y divide-[var(--ia-border)]">
                    {historyPermissions.map((p: any) => (
                      <tr key={p.id} className="hover:bg-[var(--ia-elevated)] transition-colors">
                        <td className="px-4 py-3"><p className="text-[var(--ia-text)] font-medium text-sm">{p.member_name}</p><p className="text-[11px] text-[var(--ia-text-muted)] font-mono">{p.roll_number} &middot; {p.department} &middot; {formatYear(p.year)} &middot; {p.section}</p></td>
                        <td className="px-4 py-3 text-[var(--ia-text-secondary)]"><p className="text-xs">{p.date}</p><p className="text-[11px] text-[var(--ia-text-muted)]">{p.approved_at ? formatISTTime(p.approved_at) : p.time}</p></td>
                        <td className="px-4 py-3 text-xs space-y-0.5"><p className="text-[var(--ia-text-secondary)]">Purpose: {p.purpose}</p><p className="text-[var(--ia-text-muted)]">Processed by {p.hod_name}</p></td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${p.effective_status === 'granted' ? 'status-granted' : p.effective_status === 'completed' ? 'bg-[var(--ia-info)]/10 text-[var(--ia-info)] border border-[var(--ia-info)]/15' : p.effective_status === 'expired' || p.effective_status === 'closed' ? 'bg-[var(--ia-completed)]/10 text-[var(--ia-completed)] border border-[var(--ia-completed)]/15' : 'status-rejected'}`}>
                            {p.effective_status ? p.effective_status.charAt(0).toUpperCase() + p.effective_status.slice(1) : p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {historyPermissions.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-[var(--ia-text-muted)] text-sm">No history found.</td></tr>}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} total={totalHistory} />
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <AttendanceReportForm userRole="coordinator" />
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fade-in">
            <NotificationComposer userRole="coordinator" clubId={user?.club_id || ''} onSuccess={loadNotifications} />

            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-[var(--ia-border)] flex justify-between items-center bg-[var(--ia-bg)]/50 rounded-t-lg">
                <h3 className="font-semibold text-sm text-[var(--ia-text)]">Notification Center</h3>
                {notifications.some(n => n.read_status === 0) && (
                  <button onClick={markAllRead} className="text-xs text-[var(--ia-accent)] hover:text-[var(--ia-accent)]/80 font-medium">Mark all as read</button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[60vh]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 opacity-50">
                    <Bell className="w-12 h-12 mb-3 text-[var(--ia-text-muted)]" />
                    <p className="text-sm font-medium text-[var(--ia-text)]">No notifications yet</p>
                    <p className="text-xs text-[var(--ia-text-muted)] mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--ia-border)]">
                    {notifications.map((n: any) => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-[var(--ia-elevated)] transition-colors ${n.read_status === 0 ? 'bg-[var(--ia-accent)]/5' : ''}`}>
                        <p className="text-sm text-[var(--ia-text)] font-medium">{n.title}</p>
                        <p className="text-[13px] text-[var(--ia-text-secondary)] mt-0.5 whitespace-pre-wrap">{n.message}</p>
                        <p className="text-[11px] text-[var(--ia-text-muted)] mt-1">{new Date(n.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QR Management Tab */}
        {activeTab === 'qr' && (
          <div className="animate-fade-in">
            {!selectedMember ? (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-10 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[var(--ia-accent)]/10 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-6 h-6 text-[var(--ia-accent)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--ia-text)] mb-1">No Member Selected</h3>
                <p className="text-[var(--ia-text-secondary)] text-sm mb-5">Select a member from the Members List to view or manage their QR code.</p>
                <button onClick={() => setActiveTab('members')} className="px-4 py-2 rounded-md bg-[var(--ia-accent)] hover:bg-[var(--ia-accent-hover)] text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5"><Users className="w-4 h-4" /> Go to Members List</button>
              </div>
            ) : (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center md:items-start shadow-sm">
                <div className="shrink-0"><div className="bg-white p-2 rounded-lg"><img src={qrDataUrl} alt="QR Code" className="w-48 h-48 md:w-56 md:h-56 object-contain" /></div></div>
                <div className="flex-1 space-y-5 w-full text-center md:text-left">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--ia-text)]">{selectedMember.full_name}</h2>
                    <p className="text-[var(--ia-text-secondary)] font-mono mt-1 text-sm">{selectedMember.roll_number}</p>
                    <p className="text-[var(--ia-text-muted)] text-[11px] mt-1">ID: {selectedMember.member_id}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button onClick={() => setShowFullscreenQR(true)} className="flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] transition-colors"><Maximize2 className="w-4 h-4" /><span className="text-xs font-medium">Fullscreen</span></button>
                    <button onClick={downloadQR} className="flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] transition-colors"><Download className="w-4 h-4" /><span className="text-xs font-medium">Download</span></button>
                    <button onClick={printQR} className="flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] transition-colors"><Printer className="w-4 h-4" /><span className="text-xs font-medium">Print</span></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function Pagination({ page, setPage, total }: { page: number; setPage: (fn: (p: number) => number) => void; total: number }) {
  return (
    <div className="px-4 py-2.5 border-t border-[var(--ia-border)] flex items-center justify-between bg-[var(--ia-elevated)]">
      <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-md bg-[var(--ia-surface)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs hover:bg-[var(--ia-border)] disabled:opacity-30 transition-colors flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5" /> Prev</button>
      <span className="text-[11px] text-[var(--ia-text-muted)]">Page {page}</span>
      <button onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-md bg-[var(--ia-surface)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs hover:bg-[var(--ia-border)] transition-colors flex items-center gap-1">Next <ChevronRight className="w-3.5 h-3.5" /></button>
    </div>
  );
}
