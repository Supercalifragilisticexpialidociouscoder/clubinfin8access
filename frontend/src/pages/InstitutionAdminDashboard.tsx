import { formatYear, formatDateTime } from '../utils/formatters';
import { useEffect, useState } from 'react';
import ISTTime from '../components/ISTTime';
import { PermissionTimer, formatISTTime } from '../components/ActiveTimer';
import { ThemeToggle } from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import AttendanceReportForm from '../components/AttendanceReportForm';
import NotificationComposer from '../components/NotificationComposer';
import {
  BarChart3, Users, ClipboardList, ScrollText, Download, Shield,
  UserPlus, Building2, Settings, Activity, Bell, LogOut,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, Plus, Pencil,
  UserX, UserCheck, RotateCcw, ArrowRightLeft, Calendar, Clock,
  FileText, AlertTriangle, Trash2, Eye, QrCode, Printer, Maximize2
} from 'lucide-react';
import QRCode from 'qrcode';

type TabKey = 'overview' | 'members' | 'permissions' | 'clubs' | 'reports' | 'notifications';

export default function InstitutionAdminDashboard() {

  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [hods, setHods] = useState<any[]>([]);
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settingsData, setSettingsData] = useState<any>({});
  const [healthData, setHealthData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterClub, setFilterClub] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [totalMembers, setTotalMembers] = useState(0);
  const [page, setPage] = useState(1);

  // Modal states
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState<any>(null);
  const [showAddHOD, setShowAddHOD] = useState(false);
  const [showEditHOD, setShowEditHOD] = useState<any>(null);
  const [showAddClub, setShowAddClub] = useState(false);
  const [showEditClub, setShowEditClub] = useState<any>(null);
  const [showResetPassword, setShowResetPassword] = useState<any>(null);
  const [showTransfer, setShowTransfer] = useState<any>(null);
  const [showViewQR, setShowViewQR] = useState<any>(null);
  const [clubStats, setClubStats] = useState<any>(null);

  // Confirm dialog
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; action: () => void }>({ open: false, title: '', message: '', action: () => {} });

  // Bulk selection
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    loadStats();
    loadClubs();
    loadNotifications();
  }, []);

  useEffect(() => {
    if (activeTab === 'members') loadMembers();
    if (activeTab === 'permissions') loadPermissions();
  }, [activeTab, page, searchQuery, filterDepartment, filterClub, filterDate, filterStatus]);

  const loadStats = async () => {
    try { const res = await apiCall('/api/stats'); if (res.ok) setStats(await res.json()); } catch { }
  };
  const loadClubs = async () => {
    try { const res = await apiCall('/api/clubs'); if (res.ok) { const d = await res.json(); setClubs(d.clubs || []); } } catch { }
  };
  const loadMembers = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '30' });
      if (searchQuery) p.set('search', searchQuery);
      if (filterDepartment) p.set('department', filterDepartment);
      if (filterClub) p.set('club', filterClub);
      if (filterStatus) p.set('status', filterStatus);
      const res = await apiCall(`/api/members?${p}`);
      if (res.ok) { const d = await res.json(); setMembers(d.members || []); setTotalMembers(d.total || 0); }
    } catch { }
  };
  const loadPermissions = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '30' });
      if (filterDate) p.set('date', filterDate);
      if (filterClub) p.set('club', filterClub);
      if (filterDepartment) p.set('department', filterDepartment);
      const res = await apiCall(`/api/permissions?${p}`);
      if (res.ok) { const d = await res.json(); setPermissions(d.permissions || []); }
    } catch { }
  };
  const loadAuditLogs = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '30' });
      if (filterDate) p.set('date', filterDate);
      const res = await apiCall(`/api/audit-logs?${p}`);
      if (res.ok) { const d = await res.json(); setAuditLogs(d.logs || []); }
    } catch { }
  };
  const loadHods = async () => {
    try { const res = await apiCall('/api/admin/hods'); if (res.ok) { const d = await res.json(); setHods(d.hods || []); } } catch { }
  };
  const loadCoordinators = async () => {
    try { const res = await apiCall('/api/admin/coordinators'); if (res.ok) { const d = await res.json(); setCoordinators(d.coordinators || []); } } catch { }
  };
  const loadNotifications = async () => {
    try { const res = await apiCall('/api/notifications'); if (res.ok) { const d = await res.json(); setNotifications(d.notifications || []); setUnreadCount(d.unread_count || 0); } } catch { }
  };
  const loadSettings = async () => {
    try { const res = await apiCall('/api/settings'); if (res.ok) { const d = await res.json(); setSettingsData(d.settings || {}); } } catch { }
  };
  const loadHealth = async () => {
    try { const res = await apiCall('/api/admin/health'); if (res.ok) setHealthData(await res.json()); } catch { }
  };

  const exportData = async (type: string) => {
    try {
      const p = new URLSearchParams({ format: 'csv' });
      if (filterDate) { p.set('date_from', filterDate); p.set('date_to', filterDate); }
      if (filterClub) p.set('club', filterClub);
      if (filterDepartment) p.set('department', filterDepartment);
      if (filterStatus) p.set('status', filterStatus);
      const res = await apiCall(`/api/export/${type}?${p}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`; a.click();
        URL.revokeObjectURL(url);
        toast('success', `${type} data exported successfully.`);
      }
    } catch { toast('error', 'Export failed.'); }
  };

  // CRUD Operations
  const createMember = async (data: any) => {
    try {
      const res = await apiCall('/api/admin/members', { method: 'POST', body: JSON.stringify(data) });
      const result = await res.json();
      if (res.ok) {
        toast('success', `Student record created successfully. Member ID: ${result.member_id}`);
        setShowAddMember(false);
        loadMembers(); loadStats();
      } else { toast('error', result.error || 'Failed to create member.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const updateMember = async (uuid: string, data: any) => {
    try {
      const res = await apiCall(`/api/admin/members/${uuid}`, { method: 'PUT', body: JSON.stringify(data) });
      if (res.ok) {
        toast('success', 'Member record updated successfully.');
        setShowEditMember(null); loadMembers(); loadStats();
      } else { const r = await res.json(); toast('error', r.error || 'Update failed.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const updateMemberStatus = async (uuid: string, status: string) => {
    await updateMember(uuid, { status });
  };

  const resetStudentPassword = async (uuid: string) => {
    try {
      const res = await apiCall(`/api/admin/members/${uuid}/reset-password`, { method: 'POST' });
      if (res.ok) { toast('success', 'Password reset successfully. Temporary password is the student roll number.'); }
      else { toast('error', 'Failed to reset password.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const transferMember = async (uuid: string, newClubId: number) => {
    try {
      const res = await apiCall(`/api/admin/members/${uuid}/transfer`, { method: 'POST', body: JSON.stringify({ new_club_id: newClubId }) });
      const result = await res.json();
      if (res.ok) {
        toast('success', `Member transferred from ${result.old_club} to ${result.new_club}.`);
        setShowTransfer(null); loadMembers();
      } else { toast('error', result.error || 'Transfer failed.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const regenerateQR = async (uuid: string) => {
    try {
      const res = await apiCall(`/api/members/${uuid}/regenerate-qr`, { method: 'POST' });
      if (res.ok) { toast('success', 'QR code regenerated. Previous QR has been invalidated.'); loadMembers(); }
      else { toast('error', 'Failed to regenerate QR.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const createHOD = async (data: any) => {
    try {
      const res = await apiCall('/api/admin/hods', { method: 'POST', body: JSON.stringify(data) });
      if (res.ok) { toast('success', 'HOD account created successfully.'); setShowAddHOD(false); loadHods(); }
      else { const r = await res.json(); toast('error', r.error || 'Failed to create HOD.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const updateHOD = async (id: string, data: any) => {
    try {
      const res = await apiCall(`/api/admin/hods/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      if (res.ok) { toast('success', 'HOD record updated.'); setShowEditHOD(null); loadHods(); }
      else { const r = await res.json(); toast('error', r.error || 'Update failed.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const resetHODPassword = async (id: string, password: string) => {
    try {
      const res = await apiCall(`/api/admin/hods/${id}/reset-password`, { method: 'POST', body: JSON.stringify({ password }) });
      if (res.ok) { toast('success', 'HOD password reset successfully.'); setShowResetPassword(null); }
      else { const r = await res.json(); toast('error', r.error || 'Failed to reset password.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const createClub = async (data: any) => {
    try {
      const res = await apiCall('/api/admin/clubs', { method: 'POST', body: JSON.stringify(data) });
      if (res.ok) { toast('success', 'Club created successfully.'); setShowAddClub(false); loadClubs(); }
      else { const r = await res.json(); toast('error', r.error || 'Failed.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const updateClub = async (id: number, data: any) => {
    try {
      const res = await apiCall(`/api/admin/clubs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      if (res.ok) { toast('success', 'Club updated.'); setShowEditClub(null); loadClubs(); }
      else { const r = await res.json(); toast('error', r.error || 'Failed.'); }
    } catch { toast('error', 'Network error.'); }
  };

  const saveSettings = async () => {
    try {
      const res = await apiCall('/api/settings', { method: 'PUT', body: JSON.stringify(settingsData) });
      if (res.ok) toast('success', 'Settings saved successfully.');
      else toast('error', 'Failed to save settings.');
    } catch { toast('error', 'Network error.'); }
  };

  const loadClubStats = async (clubId: number) => {
    try {
      const res = await apiCall(`/api/clubs/${clubId}/stats`);
      if (res.ok) setClubStats(await res.json());
    } catch { }
  };

  
  const closePermission = async (id: string) => {
    try {
      const res = await apiCall(`/api/permissions/${id}/close`, { method: 'POST' });
      if (res.ok) {
        toast('success', 'Permission closed successfully.');
        loadPermissions();
      } else {
        const r = await res.json();
        toast('error', r.error || 'Failed to close permission.');
      }
    } catch {
      toast('error', 'Network error.');
    }
  };

  const bulkAction = async (action: string) => {
    if (selectedMembers.length === 0) { toast('warning', 'No members selected.'); return; }
    try {
      const res = await apiCall('/api/admin/members/bulk', { method: 'POST', body: JSON.stringify({ action, member_uuids: selectedMembers }) });
      const r = await res.json();
      if (res.ok) { toast('success', `Bulk ${action}: ${r.processed}/${r.total} processed.`); setSelectedMembers([]); loadMembers(); loadStats(); }
      else toast('error', r.error || 'Bulk operation failed.');
    } catch { toast('error', 'Network error.'); }
  };

  const markAllRead = async () => {
    await apiCall('/api/notifications/read-all', { method: 'PATCH' });
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read_status: 1 })));
    toast('success', 'All notifications marked as read.');
  };

  const tabs: { key: TabKey; label: string; icon: typeof BarChart3 }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'members', label: 'Members', icon: Users },
    { key: 'clubs', label: 'Clubs', icon: Building2 },
    { key: 'permissions', label: 'Permissions', icon: ClipboardList },
    { key: 'reports', label: 'Reports', icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-[var(--ia-bg)] flex flex-col">
      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} variant="danger" confirmLabel="Confirm" cancelLabel="Cancel" onConfirm={() => { confirm.action(); setConfirm({ ...confirm, open: false }); }} onCancel={() => setConfirm({ ...confirm, open: false })} />

      {/* Modals */}
      {showAddClub && <ClubFormModal onSave={createClub} onClose={() => setShowAddClub(false)} />}
      {showEditClub && <ClubFormModal club={showEditClub} onSave={(d) => updateClub(showEditClub.id, d)} onClose={() => setShowEditClub(null)} />}
      {showTransfer && <TransferModal member={showTransfer} clubs={clubs} onTransfer={(clubId) => transferMember(showTransfer.uuid, clubId)} onClose={() => setShowTransfer(null)} />}
      {showViewQR && <ViewQRModal member={showViewQR} settings={settingsData} onClose={() => setShowViewQR(null)} />}

      {/* Header */}
      <header className="bg-[var(--ia-surface)] border-b border-[var(--ia-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--ia-danger)]/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[var(--ia-danger)]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[var(--ia-text)]">Infin8 Access Monitoring</h1>
              <p className="text-[11px] text-[var(--ia-text-muted)] font-medium uppercase tracking-wider">Institution Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ISTTime />
            </div>
            <div className="hidden sm:block h-5 w-px bg-[var(--ia-border)]" />
            
            {unreadCount > 0 && (
              <button onClick={() => setActiveTab('notifications')} className="relative w-8 h-8 rounded-md bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] flex items-center justify-center text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--ia-danger)] text-white text-[9px] flex items-center justify-center font-bold">{unreadCount}</span>
              </button>
            )}
            <ThemeToggle />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-[var(--ia-text)]">{user?.name}</p>
              <p className="text-[11px] text-[var(--ia-text-muted)]">Institution Admin</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="px-2.5 py-1.5 rounded-md bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] text-xs transition-colors flex items-center gap-1.5" aria-label="Logout">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 flex-1 w-full">
        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-[var(--ia-border)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }}
                className={`flex items-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.key ? 'border-[var(--ia-danger)] text-[var(--ia-danger)]' : 'border-transparent text-[var(--ia-text-muted)] hover:text-[var(--ia-text-secondary)]'}`}>
                <Icon className="w-3.5 h-3.5" /> <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Members" value={stats.total_members} icon={Users} />
              <StatCard label="Active Members" value={stats.active_members} icon={UserCheck} />
              <StatCard label="Total Clubs" value={stats.total_clubs} icon={Building2} />
              <StatCard label="Today's Permissions" value={stats.today_permissions} icon={ClipboardList} />
              <StatCard label="Total Permissions" value={stats.total_permissions} icon={Calendar} />
              <StatCard label="Granted Today" value={stats.today_granted} icon={CheckCircle2} />
              <StatCard label="Rejected Today" value={stats.today_rejected} icon={XCircle} />
              <StatCard label="Suspended" value={stats.suspended_members} icon={UserX} />
            </div>
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
              <h3 className="font-semibold text-sm text-[var(--ia-text)] mb-3">Clubs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {clubs.map((c: any) => (
                  <div key={c.id} className="p-3 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] hover:border-[var(--ia-accent)] transition-colors cursor-pointer" onClick={() => { setActiveTab('clubs'); loadClubStats(c.id); }}>
                    <p className="text-[var(--ia-text)] font-medium text-sm">{c.name}</p>
                    <p className="text-[11px] text-[var(--ia-text-muted)]">ID: {c.id} {c.status === 'disabled' ? '(Disabled)' : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Members */}
        {activeTab === 'members' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-2">
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setPage(1); }} className="flex-1" />
              <select value={filterDepartment} onChange={(e) => { setFilterDepartment(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]">
                <option value="">All Departments</option>
                {['CSE', 'CSE-DS', 'CSE-AI/ML', 'ECE', 'IOT/R&A', 'BBA'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]">
                <option value="">All Statuses</option>
                {['active', 'suspended', 'archived', 'graduated'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">{totalMembers} members found</p>
            </div>

            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]">
                      <th className="px-4 py-2.5 w-8"><input type="checkbox" onChange={(e) => { if (e.target.checked) setSelectedMembers(members.map(m => m.uuid)); else setSelectedMembers([]); }} className="rounded border-[var(--ia-border)] bg-[var(--ia-input)] text-[var(--ia-accent)] focus:ring-[var(--ia-accent)]" /></th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Member</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--ia-border)]">
                    {members.map((m: any) => (
                      <tr key={m.id} className="hover:bg-[var(--ia-elevated)] transition-colors">
                        <td className="px-4 py-3"><input type="checkbox" checked={selectedMembers.includes(m.uuid)} onChange={(e) => { if (e.target.checked) setSelectedMembers(p => [...p, m.uuid]); else setSelectedMembers(p => p.filter(x => x !== m.uuid)); }} className="rounded border-[var(--ia-border)] bg-[var(--ia-input)] text-[var(--ia-accent)] focus:ring-[var(--ia-accent)]" /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate(`/verify/${m.uuid}`)}>
                            <div className="w-7 h-7 rounded-md bg-[var(--ia-danger)]/12 flex items-center justify-center text-xs font-semibold text-[var(--ia-danger)]">{m.full_name?.charAt(0)}</div>
                            <div><p className="text-[var(--ia-text)] font-medium text-sm">{m.full_name}</p><p className="text-[11px] text-[var(--ia-text-muted)]">{m.roll_number} &middot; {m.department} &middot; {formatYear(m.year)} &middot; {m.section} &middot; {m.club_name}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded font-medium ${m.status === 'active' ? 'status-active' : m.status === 'suspended' ? 'status-inactive' : 'bg-[var(--ia-completed)]/10 text-[var(--ia-completed)] border border-[var(--ia-completed)]/15'}`}>{m.status || 'active'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} />
            </div>
          </div>
        )}

        {/* Permissions */}
        {activeTab === 'permissions' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]" />
              <select value={filterClub} onChange={(e) => { setFilterClub(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]">
                <option value="">All Clubs</option>
                {clubs.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]">
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Member</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Date / Time</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide hidden md:table-cell">Purpose</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide hidden md:table-cell">Approved By</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[var(--ia-border)]">
                    {permissions.length === 0 ? (<tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--ia-text-muted)] text-sm">No permissions found</td></tr>) :
                    permissions.map((p: any) => (
                      <tr key={p.id} className="hover:bg-[var(--ia-elevated)] transition-colors">
                        <td className="px-4 py-3"><p className="text-[var(--ia-text)] font-medium text-sm">{(p.member_name || '').trim()}</p><p className="text-[11px] text-[var(--ia-text-muted)]">{p.roll_number} &middot; {p.department} &middot; {formatYear(p.year)} &middot; {p.section} &middot; {p.club_name}</p></td>
                        <td className="px-4 py-3 text-[var(--ia-text-secondary)] text-xs"><p>{p.date}</p><p className="text-[11px] text-[var(--ia-text-muted)]">{p.approved_at ? formatISTTime(p.approved_at) : p.time}</p></td>
                        <td className="px-4 py-3 text-[var(--ia-text-secondary)] text-xs hidden md:table-cell">{p.purpose || '—'}</td>
                        <td className="px-4 py-3 text-[var(--ia-text-secondary)] text-xs hidden md:table-cell">{p.hod_name ? `${p.hod_name} (${p.hod_role === 'poc' ? 'POC' : 'HOD'})` : '—'}</td>
                        <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1 w-fit ${p.effective_status === 'active' ? 'status-granted' : p.effective_status === 'closed' ? 'bg-[var(--ia-info)]/10 text-[var(--ia-info)] border border-[var(--ia-info)]/15' : p.effective_status === 'expired' ? 'bg-[var(--ia-completed)]/10 text-[var(--ia-completed)] border border-[var(--ia-completed)]/15' : 'status-rejected'}`}>
                          {p.effective_status === 'active' ? <><CheckCircle2 className="w-3 h-3" /> Active</> : p.effective_status === 'expired' ? <><Clock className="w-3 h-3" /> Expired</> : p.effective_status === 'closed' ? <><CheckCircle2 className="w-3 h-3" /> Closed</> : <><XCircle className="w-3 h-3" /> Rejected</>}
                        </span> {p.effective_status !== 'rejected' && p.approved_at && <div className="text-[10px] text-[var(--ia-text-muted)] mt-1 font-medium"><PermissionTimer permission={p} /></div>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} />
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <AttendanceReportForm userRole="institution_admin" />
          </div>
        )}

        {/* Clubs */}
        {activeTab === 'clubs' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[var(--ia-text)]">Club Management</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {clubs.map((c: any) => (
                <div key={c.id} className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[var(--ia-text)] font-semibold text-sm">{c.name}</h4>
                    <div className="flex gap-1">
                      <button onClick={() => loadClubStats(c.id)} className="p-1 rounded hover:bg-[var(--ia-border)] text-[var(--ia-text-muted)] hover:text-[var(--ia-text)] transition-colors"><BarChart3 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--ia-text-secondary)]">{c.description || 'No description'}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium mt-3 inline-block ${c.status === 'disabled' ? 'status-inactive' : 'status-active'}`}>{c.status || 'active'}</span>
                </div>
              ))}
            </div>
            {/* Club Stats Modal */}
            {clubStats && (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--ia-text)] text-sm">Club Statistics — {clubStats.club?.name}</h3>
                  <button onClick={() => setClubStats(null)} className="text-[var(--ia-text-muted)] hover:text-[var(--ia-text)] transition-colors text-xs">Close</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <StatMini label="Total Members" value={clubStats.stats.total_members} />
                  <StatMini label="Active" value={clubStats.stats.active_members} />
                  <StatMini label="Suspended" value={clubStats.stats.suspended_members} />
                  <StatMini label="Archived" value={clubStats.stats.archived_members} />
                  <StatMini label="Faculty Count" value={clubStats.stats.faculty_count} />
                </div>
                {clubStats.coordinators?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--ia-border)]">
                    <p className="text-[11px] text-[var(--ia-text-muted)] uppercase tracking-wide mb-2 font-medium">Assigned Coordinators</p>
                    <div className="space-y-1">
                      {clubStats.coordinators.map((fc: any) => (
                        <p key={fc.id} className="text-[13px] text-[var(--ia-text-secondary)] font-medium">{fc.name} — <span className="font-normal text-[var(--ia-text-muted)]">{fc.email}</span></p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]" />
            </div>
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]">
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Timestamp</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Action</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Admin / Performed By</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide hidden md:table-cell">Target</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[var(--ia-border)]">
                    {auditLogs.length === 0 ? (<tr><td colSpan={4} className="px-4 py-8 text-center text-[var(--ia-text-muted)] text-sm">No audit logs found</td></tr>) :
                    auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-[var(--ia-elevated)] transition-colors">
                        <td className="px-4 py-3 text-[var(--ia-text-secondary)] text-xs"><p>{formatDateTime(log.created_at)}</p></td>
                        <td className="px-4 py-3 text-[var(--ia-text)] text-xs font-medium">{log.action}</td>
                        <td className="px-4 py-3 text-[var(--ia-text-secondary)] text-xs">{log.admin_name} ({log.admin_type})</td>
                        <td className="px-4 py-3 text-[var(--ia-text-muted)] text-xs hidden md:table-cell">{log.target_type} : {log.target_id} <br/><span className="text-[10px]">{log.details}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} />
            </div>
          </div>
        )}
        
        {/* Users */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]">
                <h3 className="font-semibold text-sm text-[var(--ia-text)]">Department HODs</h3>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {hods.map((h: any) => (
                  <div key={h.id} className="p-3 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] hover:border-[var(--ia-accent)] transition-colors">
                    <p className="text-[var(--ia-text)] font-medium text-sm">{h.name}</p>
                    <p className="text-[11px] text-[var(--ia-text-muted)]">{h.department} &middot; {h.email}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium mt-2 inline-block ${h.status === 'disabled' ? 'status-inactive' : 'status-active'}`}>{h.status || 'active'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]">
                <h3 className="font-semibold text-sm text-[var(--ia-text)]">Faculty Coordinators</h3>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coordinators.map((c: any) => (
                  <div key={c.id} className="p-3 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] hover:border-[var(--ia-accent)] transition-colors">
                    <p className="text-[var(--ia-text)] font-medium text-sm">{c.name}</p>
                    <p className="text-[11px] text-[var(--ia-text-muted)]">{c.club_name} &middot; {c.email}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium mt-2 inline-block ${c.status === 'disabled' ? 'status-inactive' : 'status-active'}`}>{c.status || 'active'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fade-in max-w-2xl">
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
              <h3 className="font-semibold text-[var(--ia-text)] text-sm mb-4">Application Settings</h3>
              <div className="space-y-4">
                <SettingField label="College Name" value={settingsData.college_name || ''} onChange={(v) => setSettingsData({ ...settingsData, college_name: v })} />
                <SettingField label="QR Code URL Prefix" value={settingsData.qr_url_prefix || ''} onChange={(v) => setSettingsData({ ...settingsData, qr_url_prefix: v })} />
                <SettingField label="Support Email" value={settingsData.support_email || ''} onChange={(v) => setSettingsData({ ...settingsData, support_email: v })} />
                <div className="pt-2 border-t border-[var(--ia-border)]">
                  <button onClick={saveSettings} className="px-4 py-2 rounded-md bg-[var(--ia-danger)] hover:bg-red-700 text-white text-xs font-medium transition-colors">Save Settings</button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Health */}
        {activeTab === 'health' && healthData && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <HealthItem label="Database Connection" value={healthData.database === 'connected' ? 'Healthy' : 'Error'} isGood={healthData.database === 'connected'} />
              <HealthItem label="System Time" value={healthData.system_time} isGood={true} />
              <HealthItem label="Version" value={healthData.version || 'v1.2'} isGood={true} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ============ Sub-components ============

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-4 hover:border-[var(--ia-accent)] transition-colors">
      <Icon className="w-5 h-5 text-[var(--ia-text-muted)]" />
      <p className="text-2xl font-bold text-[var(--ia-text)] mt-2">{value}</p>
      <p className="text-[11px] font-medium text-[var(--ia-text-secondary)] mt-0.5 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)]">
      <p className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">{label}</p>
      <p className="text-base font-semibold text-[var(--ia-text)] mt-0.5">{value}</p>
    </div>
  );
}

function ExportCard({ title, description, icon: Icon, onExport }: { title: string; description: string; icon: typeof Users; onExport: () => void }) {
  return (
    <div className="p-4 rounded-md bg-[var(--ia-surface)] border border-[var(--ia-border)] hover:border-[var(--ia-danger)] transition-colors">
      <Icon className="w-4 h-4 text-[var(--ia-text-muted)]" />
      <h4 className="text-[var(--ia-text)] font-semibold text-sm mt-2">{title}</h4>
      <p className="text-[11px] text-[var(--ia-text-secondary)] mt-1">{description}</p>
      <button onClick={onExport} className="mt-3 w-full py-2 rounded-md bg-[var(--ia-danger)]/10 text-[var(--ia-danger)] hover:bg-[var(--ia-danger)]/20 text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
        <Download className="w-3.5 h-3.5" /> Download CSV
      </button>
    </div>
  );
}

function Pagination({ page, setPage }: { page: number; setPage: (fn: (p: number) => number) => void }) {
  return (
    <div className="px-4 py-2.5 border-t border-[var(--ia-border)] flex items-center justify-between bg-[var(--ia-elevated)]">
      <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-md bg-[var(--ia-surface)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs hover:bg-[var(--ia-border)] disabled:opacity-30 transition-colors flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5" /> Previous</button>
      <span className="text-[11px] text-[var(--ia-text-muted)]">Page {page}</span>
      <button onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-md bg-[var(--ia-surface)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs hover:bg-[var(--ia-border)] transition-colors flex items-center gap-1">Next <ChevronRight className="w-3.5 h-3.5" /></button>
    </div>
  );
}

function SettingField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wide mb-1.5 block">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-danger)] transition-colors" />
    </div>
  );
}

function HealthItem({ label, value, isGood }: { label: string; value: string; isGood: boolean }) {
  return (
    <div className="p-3 rounded-md bg-[var(--ia-surface)] border border-[var(--ia-border)]">
      <p className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <div className={`w-1.5 h-1.5 rounded-full ${isGood ? 'bg-[var(--ia-success)]' : 'bg-[var(--ia-danger)]'}`} />
        <p className="text-xs text-[var(--ia-text)] font-medium">{value}</p>
      </div>
    </div>
  );
}

// ============ Modal Forms ============

function ModalWrapper({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-xl">
        <h3 className="text-base font-semibold text-[var(--ia-text)] mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function MemberFormModal({ member, clubs, onSave, onClose }: { member?: any; clubs: any[]; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    roll_number: member?.roll_number || '', full_name: member?.full_name || '', email: member?.email || '',
    phone: member?.phone || '', department: member?.department || '', section: member?.section || '',
    year: member?.year || 2, club_id: member?.club_id || '', status: member?.status || 'active', position: member?.position || '',
  });
  const u = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <ModalWrapper title={member ? 'Edit Student' : 'Add Student'} onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Roll Number *</label><input value={form.roll_number} onChange={(e) => u('roll_number', e.target.value)} disabled={!!member} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)] disabled:opacity-50" /></div>
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Full Name *</label><input value={form.full_name} onChange={(e) => u('full_name', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Email</label><input value={form.email} onChange={(e) => u('email', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Phone</label><input value={form.phone} onChange={(e) => u('phone', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Department *</label>
            <select value={form.department} onChange={(e) => u('department', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]">
              <option value="">Select</option>{['CSE', 'CSE-DS', 'CSE-AI/ML', 'ECE', 'IOT/R&A', 'BBA'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Section</label><input value={form.section} onChange={(e) => u('section', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Year</label><input type="number" min={1} max={4} value={form.year} onChange={(e) => u('year', parseInt(e.target.value))} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Club</label>
            <select value={form.club_id} onChange={(e) => u('club_id', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]">
              <option value="">Select Club</option>{clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        {member && (
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Status</label>
            <select value={form.status} onChange={(e) => u('status', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]">
              {['active', 'suspended', 'archived', 'graduated'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        <div className="flex gap-2 pt-3 border-t border-[var(--ia-border)] mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs font-medium hover:bg-[var(--ia-border)] transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2 rounded-md bg-[var(--ia-danger)] text-white text-xs font-medium hover:bg-red-700 transition-colors">{member ? 'Save Changes' : 'Create Student'}</button>
        </div>
        {!member && <p className="text-[10px] text-[var(--ia-text-muted)] mt-2">Login credentials will be automatically created. Username and temporary password will be the roll number.</p>}
      </div>
    </ModalWrapper>
  );
}

function HODFormModal({ hod, onSave, onClose }: { hod?: any; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: hod?.name || '', department: hod?.department || '', email: hod?.email || '', password: '', status: hod?.status || 'active' });
  const u = (k: string, v: any) => setForm({ ...form, [k]: v });
  return (
    <ModalWrapper title={hod ? 'Edit HOD' : 'Add HOD'} onClose={onClose}>
      <div className="space-y-3">
        <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Name *</label><input value={form.name} onChange={(e) => u('name', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
        <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Department *</label>
          <select value={form.department} onChange={(e) => u('department', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]">
            <option value="">Select</option>{['CSE', 'CSE-DS', 'CSE-AI/ML', 'ECE', 'IOT/R&A', 'BBA'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Email *</label><input type="email" value={form.email} onChange={(e) => u('email', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
        {!hod && <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Password *</label><input type="password" value={form.password} onChange={(e) => u('password', e.target.value)} placeholder="Min 12 chars, uppercase, lowercase, number, special" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)] placeholder-[var(--ia-text-muted)]" /></div>}
        {hod && <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Status</label>
          <select value={form.status} onChange={(e) => u('status', e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]"><option value="active">Active</option><option value="disabled">Disabled</option></select></div>}
        <div className="flex gap-2 pt-3 border-t border-[var(--ia-border)] mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs font-medium hover:bg-[var(--ia-border)] transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2 rounded-md bg-[var(--ia-danger)] text-white text-xs font-medium hover:bg-red-700 transition-colors">{hod ? 'Save Changes' : 'Create HOD'}</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function ClubFormModal({ club, onSave, onClose }: { club?: any; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: club?.name || '', description: club?.description || '', status: club?.status || 'active' });
  return (
    <ModalWrapper title={club ? 'Edit Club' : 'Create Club'} onClose={onClose}>
      <div className="space-y-3">
        <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Club Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
        <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
        {club && <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]"><option value="active">Active</option><option value="disabled">Disabled</option></select></div>}
        <div className="flex gap-2 pt-3 border-t border-[var(--ia-border)] mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs font-medium hover:bg-[var(--ia-border)] transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2 rounded-md bg-[var(--ia-danger)] text-white text-xs font-medium hover:bg-red-700 transition-colors">{club ? 'Save' : 'Create'}</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function ResetPasswordModal({ target, onReset, onClose }: { target: any; onReset: (pw: string) => void; onClose: () => void }) {
  const [pw, setPw] = useState('');
  const isStudent = target.type !== 'hod';
  return (
    <ModalWrapper title={`Reset Password — ${target.name || target.full_name}`} onClose={onClose}>
      <div className="space-y-3">
        {isStudent ? (
          <p className="text-xs text-[var(--ia-text-secondary)]">Password will be reset to the student's roll number. The student will be required to change it on next login.</p>
        ) : (
          <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">New Password *</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min 12 chars" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]" /></div>
        )}
        <div className="flex gap-2 pt-3 border-t border-[var(--ia-border)] mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs font-medium hover:bg-[var(--ia-border)] transition-colors">Cancel</button>
          <button onClick={() => onReset(pw)} className="flex-1 py-2 rounded-md bg-[var(--ia-danger)] text-white text-xs font-medium hover:bg-red-700 transition-colors">Reset Password</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function TransferModal({ member, clubs, onTransfer, onClose }: { member: any; clubs: any[]; onTransfer: (clubId: number) => void; onClose: () => void }) {
  const [clubId, setClubId] = useState('');
  return (
    <ModalWrapper title={`Transfer — ${member.full_name}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-xs text-[var(--ia-text-secondary)]">Current club: <strong className="text-[var(--ia-text)]">{member.club_name}</strong></p>
        <div><label className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">New Club</label>
          <select value={clubId} onChange={(e) => setClubId(e.target.value)} className="w-full px-2.5 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-danger)]">
            <option value="">Select Club</option>{clubs.filter(c => c.id !== member.club_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <p className="text-[10px] text-[var(--ia-text-muted)] mt-1">The member's faculty coordinators will automatically update to match the new club.</p>
        <div className="flex gap-2 pt-3 border-t border-[var(--ia-border)] mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs font-medium hover:bg-[var(--ia-border)] transition-colors">Cancel</button>
          <button onClick={() => { if (clubId) onTransfer(parseInt(clubId)); }} disabled={!clubId} className="flex-1 py-2 rounded-md bg-[var(--ia-danger)] text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50">Transfer</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function ViewQRModal({ member, settings, onClose }: { member: any; settings: any; onClose: () => void }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      const prefix = settings?.qr_url_prefix || 'https://clubpass.pages.dev/verify/';
      const url = `${prefix}${member.uuid}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 250,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
      setQrDataUrl(dataUrl);
    };
    if (member?.uuid) generateQR();
  }, [member, settings]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Infin8Access-${member.roll_number || 'QR'}.png`;
    a.click();
  };

  const printQR = () => {
    if (!qrDataUrl) return;
    const win = window.open('');
    if (!win) return;
    win.document.write(`
      <html>
        <head><title>Print QR - ${member.full_name}</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
          <h2>${member.full_name}</h2>
          <p>${member.roll_number}</p>
          <img src="${qrDataUrl}" style="width:300px;height:300px;" />
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <ModalWrapper title={`Student QR — ${member.full_name}`} onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 bg-white p-2 rounded-md border border-[var(--ia-border)]" />
        ) : (
          <div className="w-48 h-48 border border-dashed border-[var(--ia-border)] rounded-md flex items-center justify-center text-[var(--ia-text-muted)] text-xs">Generating...</div>
        )}
        <div className="text-center">
          <p className="text-base font-semibold text-[var(--ia-text)]">{member.roll_number}</p>
          <p className="text-[11px] text-[var(--ia-text-muted)] mt-0.5">{member.member_id || member.uuid}</p>
        </div>
        <div className="flex w-full gap-2 pt-3 border-t border-[var(--ia-border)] mt-4">
          <button onClick={downloadQR} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] text-xs font-medium hover:bg-[var(--ia-border)] hover:text-[var(--ia-text)] transition-colors">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <button onClick={printQR} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-[var(--ia-danger)] hover:bg-red-700 text-white text-xs font-medium transition-colors">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

