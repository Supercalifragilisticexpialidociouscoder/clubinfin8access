import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  BarChart3, Users, ClipboardList, ScrollText, Download, Shield,
  UserPlus, Building2, Settings, Activity, Bell, LogOut,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, Plus, Pencil,
  UserX, UserCheck, RotateCcw, ArrowRightLeft, Calendar, Clock,
  FileText, AlertTriangle, Trash2, Eye, QrCode, Printer, Maximize2
} from 'lucide-react';
import QRCode from 'qrcode';

type TabKey = 'overview' | 'members' | 'permissions' | 'audit' | 'export' | 'users' | 'clubs' | 'settings' | 'health' | 'notifications';

export default function AdminDashboard() {
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
    if (activeTab === 'audit') loadAuditLogs();
    if (activeTab === 'users') { loadHods(); loadCoordinators(); }
    if (activeTab === 'settings') loadSettings();
    if (activeTab === 'health') loadHealth();
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
    { key: 'users', label: 'User Mgmt', icon: UserPlus },
    { key: 'clubs', label: 'Clubs', icon: Building2 },
    { key: 'permissions', label: 'Permissions', icon: ClipboardList },
    { key: 'audit', label: 'Audit', icon: ScrollText },
    { key: 'export', label: 'Export', icon: Download },
    { key: 'notifications', label: 'Alerts', icon: Bell },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'health', label: 'Health', icon: Activity },
  ];

  return (
    <div className="dark min-h-screen gradient-primary">
      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} variant="danger" confirmLabel="Confirm" onConfirm={() => { confirm.action(); setConfirm({ ...confirm, open: false }); }} onCancel={() => setConfirm({ ...confirm, open: false })} />

      {/* Modals */}
      {showAddMember && <MemberFormModal clubs={clubs} onSave={createMember} onClose={() => setShowAddMember(false)} />}
      {showEditMember && <MemberFormModal member={showEditMember} clubs={clubs} onSave={(d) => updateMember(showEditMember.uuid, d)} onClose={() => setShowEditMember(null)} />}
      {showAddHOD && <HODFormModal onSave={createHOD} onClose={() => setShowAddHOD(false)} />}
      {showEditHOD && <HODFormModal hod={showEditHOD} onSave={(d) => updateHOD(showEditHOD.id, d)} onClose={() => setShowEditHOD(null)} />}
      {showResetPassword && <ResetPasswordModal target={showResetPassword} onReset={(pw) => { if (showResetPassword.type === 'hod') resetHODPassword(showResetPassword.id, pw); else resetStudentPassword(showResetPassword.uuid); }} onClose={() => setShowResetPassword(null)} />}
      {showAddClub && <ClubFormModal onSave={createClub} onClose={() => setShowAddClub(false)} />}
      {showEditClub && <ClubFormModal club={showEditClub} onSave={(d) => updateClub(showEditClub.id, d)} onClose={() => setShowEditClub(null)} />}
      {showTransfer && <TransferModal member={showTransfer} clubs={clubs} onTransfer={(clubId) => transferMember(showTransfer.uuid, clubId)} onClose={() => setShowTransfer(null)} />}
      {showViewQR && <ViewQRModal member={showViewQR} settings={settingsData} onClose={() => setShowViewQR(null)} />}

      {/* Top Bar */}
      <header className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Infin8 Access Admin</h1>
              <p className="text-xs text-slate-500">Administration Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={() => setActiveTab('notifications')} className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>
              </button>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }}
                className={`flex items-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap px-3 ${activeTab === tab.key ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}>
                <Icon className="w-3.5 h-3.5" /> <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6 animate-fade-in">
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
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Clubs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {clubs.map((c: any) => (
                  <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer" onClick={() => { setActiveTab('clubs'); loadClubStats(c.id); }}>
                    <p className="text-white font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-slate-500">ID: {c.id} {c.status === 'disabled' ? '(Disabled)' : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Members */}
        {activeTab === 'members' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setPage(1); }} className="flex-1" />
              <select value={filterDepartment} onChange={(e) => { setFilterDepartment(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none">
                <option value="">All Departments</option>
                {['CSE', 'CSE-DS', 'CSE-AI/ML', 'ECE', 'IOT/R&A', 'BBA'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none">
                <option value="">All Statuses</option>
                {['active', 'suspended', 'archived', 'graduated'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Bulk actions */}
            {selectedMembers.length > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs text-amber-300 font-medium">{selectedMembers.length} selected</span>
                <button onClick={() => bulkAction('suspend')} className="text-xs px-3 py-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">Suspend</button>
                <button onClick={() => bulkAction('activate')} className="text-xs px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">Activate</button>
                <button onClick={() => bulkAction('archive')} className="text-xs px-3 py-1 rounded-lg bg-slate-500/15 text-slate-400 hover:bg-slate-500/25 transition-colors">Archive</button>
                <button onClick={() => exportData('members')} className="text-xs px-3 py-1 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors">Export</button>
                <button onClick={() => setSelectedMembers([])} className="text-xs px-3 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors ml-auto">Clear</button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{totalMembers} members found</p>
              <button onClick={() => setShowAddMember(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Add Student
              </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="p-4 w-8"><input type="checkbox" onChange={(e) => { if (e.target.checked) setSelectedMembers(members.map(m => m.uuid)); else setSelectedMembers([]); }} className="rounded" /></th>
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Member</th>
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {members.map((m: any) => (
                      <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4"><input type="checkbox" checked={selectedMembers.includes(m.uuid)} onChange={(e) => { if (e.target.checked) setSelectedMembers(p => [...p, m.uuid]); else setSelectedMembers(p => p.filter(x => x !== m.uuid)); }} className="rounded" /></td>
                        <td className="p-4">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/verify/${m.uuid}`)}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center text-xs font-bold text-white">{m.full_name?.charAt(0)}</div>
                            <div><p className="text-white font-medium">{m.full_name}</p><p className="text-xs text-slate-500">{m.roll_number} &middot; {m.department} &middot; Year {m.year} &middot; Section {m.section} &middot; {m.club_name}</p></div>
                          </div>
                        </td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${m.status === 'active' ? 'status-active' : m.status === 'suspended' ? 'status-inactive' : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'}`}>{m.status || 'active'}</span></td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setShowEditMember(m)} title="Edit" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          {m.member_type === 'student' && (
                            <button onClick={() => setShowViewQR(m)} title="View QR" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><QrCode className="w-3.5 h-3.5" /></button>
                          )}
                          <button onClick={() => navigate(`/verify/${m.uuid}`)} title="Verify Page" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setShowTransfer(m)} title="Transfer" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><ArrowRightLeft className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setConfirm({ open: true, title: 'Regenerate QR', message: `This will invalidate the current QR for ${m.full_name}. Continue?`, action: () => regenerateQR(m.uuid) })} title="Regenerate QR" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setConfirm({ open: true, title: 'Reset Password', message: `Reset password for ${m.full_name} to their roll number?`, action: () => resetStudentPassword(m.uuid) })} title="Reset Password" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-3 h-3" /></button>
                            {m.status === 'active' && (
                              <button onClick={() => setConfirm({ open: true, title: 'Suspend Member', message: `Suspend ${m.full_name}? They will not be able to verify.`, action: () => updateMemberStatus(m.uuid, 'suspended') })} title="Suspend" className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"><UserX className="w-3.5 h-3.5" /></button>
                            )}
                            {m.status === 'suspended' && (
                              <button onClick={() => updateMemberStatus(m.uuid, 'active')} title="Activate" className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors"><UserCheck className="w-3.5 h-3.5" /></button>
                            )}
                          </div>
                        </td>
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
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none" />
              <select value={filterClub} onChange={(e) => { setFilterClub(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none">
                <option value="">All Clubs</option>
                {clubs.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/5">
                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Member</th>
                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Date / Time</th>
                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Purpose</th>
                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Approved By</th>
                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {permissions.length === 0 ? (<tr><td colSpan={5} className="p-8 text-center text-slate-500">No permissions found</td></tr>) :
                    permissions.map((p: any) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4"><p className="text-white font-medium">{(p.member_name || '').trim()}</p><p className="text-xs text-slate-500">{p.roll_number} &middot; {p.department} &middot; Year {p.year} &middot; Section {p.section} &middot; {p.club_name}</p></td>
                        <td className="p-4 text-slate-300 text-xs"><p>{p.date}</p><p className="text-slate-500">{p.time}</p></td>
                        <td className="p-4 text-slate-400 text-xs hidden md:table-cell">{p.purpose || '—'}</td>
                        <td className="p-4 text-slate-400 text-xs hidden md:table-cell">{p.hod_name || '—'}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${p.status === 'granted' ? 'status-granted' : 'status-rejected'}`}>
                          {p.status === 'granted' ? <><CheckCircle2 className="w-3 h-3" /> Granted</> : <><XCircle className="w-3 h-3" /> Rejected</>}
                        </span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} />
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-3"><input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none" /></div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
                {auditLogs.length === 0 ? (<p className="p-8 text-center text-slate-500 text-sm">No audit logs found</p>) :
                auditLogs.map((log: any) => (
                  <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.action?.includes('GRANTED') ? 'status-granted' : log.action?.includes('REJECTED') ? 'status-rejected' : log.action?.includes('LOGIN') ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : log.action?.includes('SCANNED') ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : log.action?.includes('CREATED') ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : log.action?.includes('SUSPENDED') || log.action?.includes('ARCHIVED') ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'}`}>{log.action}</span>
                          <span className="text-xs text-slate-500">{log.user_role}</span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1 line-clamp-2">{log.details}</p>
                      </div>
                      <p className="text-xs text-slate-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={page} setPage={setPage} />
            </div>
          </div>
        )}

        {/* Export */}
        {activeTab === 'export' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2">Export Data</h3>
              <p className="text-slate-400 text-sm mb-6">Download data in CSV format (Excel-compatible).</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ExportCard title="Members" description="All club members with details" icon={Users} onExport={() => exportData('members')} />
                <ExportCard title="Permissions" description="Permission history with filters" icon={ClipboardList} onExport={() => exportData('permissions')} />
                <ExportCard title="Audit Logs" description="Complete audit trail" icon={ScrollText} onExport={() => exportData('audit-logs')} />
                <ExportCard title="Faculty" description="Faculty coordinators list" icon={UserPlus} onExport={() => exportData('faculty')} />
                <ExportCard title="Clubs" description="Club details and statistics" icon={Building2} onExport={() => exportData('clubs')} />
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            {/* HODs */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">HOD Accounts</h3>
                <button onClick={() => setShowAddHOD(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"><Plus className="w-3.5 h-3.5" /> Add HOD</button>
              </div>
              <div className="divide-y divide-white/5">
                {hods.map((h: any) => (
                  <div key={h.id} className="py-3 flex items-center justify-between">
                    <div><p className="text-sm text-white font-medium">{h.name}</p><p className="text-xs text-slate-500">{h.email} &middot; {h.department}</p></div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${h.status === 'active' || !h.status ? 'status-active' : 'status-inactive'}`}>{h.status || 'active'}</span>
                      <button onClick={() => setShowEditHOD(h)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setShowResetPassword({ ...h, type: 'hod' })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
                      <button onClick={() => updateHOD(h.id, { status: h.status === 'disabled' ? 'active' : 'disabled' })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        {h.status === 'disabled' ? <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> : <UserX className="w-3.5 h-3.5 text-red-400" />}
                      </button>
                    </div>
                  </div>
                ))}
                {hods.length === 0 && <p className="py-4 text-center text-slate-500 text-sm">No HOD accounts found.</p>}
              </div>
            </div>

            {/* Faculty Coordinators */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Faculty Coordinators</h3>
              <div className="divide-y divide-white/5">
                {coordinators.map((fc: any) => (
                  <div key={fc.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{fc.full_name}</p>
                      <p className="text-xs text-slate-500">{fc.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {fc.clubs?.map((c: any) => (
                          <span key={c.id} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">{c.name}</span>
                        ))}
                        {(!fc.clubs || fc.clubs.length === 0) && <span className="text-xs text-slate-500">No club assigned</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {coordinators.length === 0 && <p className="py-4 text-center text-slate-500 text-sm">No faculty coordinators found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Clubs */}
        {activeTab === 'clubs' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Club Management</h3>
              <button onClick={() => setShowAddClub(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Create Club</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {clubs.map((c: any) => (
                <div key={c.id} className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-bold text-sm">{c.name}</h4>
                    <div className="flex gap-1">
                      <button onClick={() => setShowEditClub(c)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => loadClubStats(c.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><BarChart3 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{c.description || 'No description'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${c.status === 'disabled' ? 'status-inactive' : 'status-active'}`}>{c.status || 'active'}</span>
                </div>
              ))}
            </div>
            {/* Club Stats Modal */}
            {clubStats && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Club Statistics — {clubStats.club?.name}</h3>
                  <button onClick={() => setClubStats(null)} className="text-slate-400 hover:text-white transition-colors text-xs">Close</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <StatMini label="Total Members" value={clubStats.stats.total_members} />
                  <StatMini label="Active" value={clubStats.stats.active_members} />
                  <StatMini label="Suspended" value={clubStats.stats.suspended_members} />
                  <StatMini label="Archived" value={clubStats.stats.archived_members} />
                  <StatMini label="Faculty Count" value={clubStats.stats.faculty_count} />
                </div>
                {clubStats.coordinators?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500 uppercase mb-2">Assigned Coordinators</p>
                    {clubStats.coordinators.map((fc: any) => (
                      <p key={fc.id} className="text-sm text-slate-300">{fc.name} — {fc.email}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Notification Center</h3>
              {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">Mark all as read</button>}
            </div>
            <div className="glass-card rounded-2xl overflow-hidden">
              {notifications.length === 0 ? (<p className="p-8 text-center text-slate-500 text-sm">No notifications</p>) : (
                <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
                  {notifications.map((n: any) => (
                    <div key={n.id} className={`p-4 hover:bg-white/[0.02] transition-colors ${n.read_status === 0 ? 'bg-blue-500/5' : ''}`}>
                      <p className="text-sm text-white font-medium">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-6">System Settings</h3>
              <div className="space-y-5">
                <SettingField label="College Name" value={settingsData.college_name || ''} onChange={(v) => setSettingsData({ ...settingsData, college_name: v })} />
                <SettingField label="College Logo URL" value={settingsData.college_logo || ''} onChange={(v) => setSettingsData({ ...settingsData, college_logo: v })} />
                <SettingField label="Member ID Prefix" value={settingsData.member_id_prefix || 'CLB'} onChange={(v) => setSettingsData({ ...settingsData, member_id_prefix: v })} />
                <SettingField label="QR URL Prefix" value={settingsData.qr_url_prefix || ''} onChange={(v) => setSettingsData({ ...settingsData, qr_url_prefix: v })} />
                <SettingField label="Session Timeout (hours)" value={settingsData.session_timeout_hours || '24'} onChange={(v) => setSettingsData({ ...settingsData, session_timeout_hours: v })} />
                <SettingField label="Password Min Length" value={settingsData.password_min_length || '12'} onChange={(v) => setSettingsData({ ...settingsData, password_min_length: v })} />
                <button onClick={saveSettings} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-colors">Save Settings</button>
              </div>
            </div>
          </div>
        )}

        {/* System Health */}
        {activeTab === 'health' && healthData && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">System Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <HealthItem label="Status" value={healthData.status} isGood={healthData.status === 'healthy'} />
                <HealthItem label="Version" value={healthData.version || '1.2'} isGood />
                <HealthItem label="Database" value={healthData.database} isGood={healthData.database === 'connected'} />
                <HealthItem label="Worker" value={healthData.worker} isGood={healthData.worker === 'running'} />
                <HealthItem label="Last Audit Log" value={healthData.last_audit_log ? new Date(healthData.last_audit_log).toLocaleString() : 'N/A'} isGood />
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <h4 className="text-sm font-medium text-white mb-3">Table Counts</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(healthData.tables || {}).map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl bg-white/5">
                      <p className="text-xs text-slate-500 uppercase">{k.replace(/_/g, ' ')}</p>
                      <p className="text-lg font-bold text-white">{String(v)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 pb-4">Infin8 Access v1.2</p>
      </div>
    </div>
  );
}

// ============ Sub-components ============

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <div className="glass-card rounded-2xl p-5 hover:bg-white/[0.03] transition-colors">
      <Icon className="w-5 h-5 text-slate-400" />
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-xl bg-white/5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function ExportCard({ title, description, icon: Icon, onExport }: { title: string; description: string; icon: typeof Users; onExport: () => void }) {
  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
      <Icon className="w-5 h-5 text-slate-400" />
      <h4 className="text-white font-bold mt-2">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
      <button onClick={onExport} className="mt-4 w-full py-2 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-sm font-medium transition-colors flex items-center justify-center gap-2">
        <Download className="w-3.5 h-3.5" /> Download CSV
      </button>
    </div>
  );
}

function Pagination({ page, setPage }: { page: number; setPage: (fn: (p: number) => number) => void }) {
  return (
    <div className="p-4 border-t border-white/5 flex items-center justify-between">
      <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 disabled:opacity-30 transition-colors flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Previous</button>
      <span className="text-xs text-slate-500">Page {page}</span>
      <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition-colors flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
    </div>
  );
}

function SettingField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300 mb-1.5 block">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
    </div>
  );
}

function HealthItem({ label, value, isGood }: { label: string; value: string; isGood: boolean }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <p className="text-xs text-slate-500 uppercase">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <div className={`w-2 h-2 rounded-full ${isGood ? 'bg-emerald-400' : 'bg-red-400'}`} />
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

// ============ Modal Forms ============

function ModalWrapper({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function MemberFormModal({ member, clubs, onSave, onClose }: { member?: any; clubs: any[]; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    roll_number: member?.roll_number || '', full_name: member?.full_name || '', email: member?.email || '',
    phone: member?.phone || '', department: member?.department || '', section: member?.section || '',
    year: member?.year || 1, club_id: member?.club_id || '', status: member?.status || 'active', position: member?.position || '',
  });
  const u = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <ModalWrapper title={member ? 'Edit Student' : 'Add Student'} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 mb-1 block">Roll Number *</label><input value={form.roll_number} onChange={(e) => u('roll_number', e.target.value)} disabled={!!member} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none disabled:opacity-50" /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Full Name *</label><input value={form.full_name} onChange={(e) => u('full_name', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 mb-1 block">Email</label><input value={form.email} onChange={(e) => u('email', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Phone</label><input value={form.phone} onChange={(e) => u('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 mb-1 block">Department *</label>
            <select value={form.department} onChange={(e) => u('department', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none">
              <option value="">Select</option>{['CSE', 'CSE-DS', 'CSE-AI/ML', 'ECE', 'IOT/R&A', 'BBA'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">Section</label><input value={form.section} onChange={(e) => u('section', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 mb-1 block">Year</label><input type="number" min={1} max={4} value={form.year} onChange={(e) => u('year', parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Club</label>
            <select value={form.club_id} onChange={(e) => u('club_id', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none">
              <option value="">Select Club</option>{clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        {member && (
          <div><label className="text-xs text-slate-400 mb-1 block">Status</label>
            <select value={form.status} onChange={(e) => u('status', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none">
              {['active', 'suspended', 'archived', 'graduated'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">{member ? 'Save Changes' : 'Create Student'}</button>
        </div>
        {!member && <p className="text-xs text-slate-500">Login credentials will be automatically created. Username and temporary password will be the roll number.</p>}
      </div>
    </ModalWrapper>
  );
}

function HODFormModal({ hod, onSave, onClose }: { hod?: any; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: hod?.name || '', department: hod?.department || '', email: hod?.email || '', password: '', status: hod?.status || 'active' });
  const u = (k: string, v: any) => setForm({ ...form, [k]: v });
  return (
    <ModalWrapper title={hod ? 'Edit HOD' : 'Add HOD'} onClose={onClose}>
      <div className="space-y-4">
        <div><label className="text-xs text-slate-400 mb-1 block">Name *</label><input value={form.name} onChange={(e) => u('name', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Department *</label>
          <select value={form.department} onChange={(e) => u('department', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none">
            <option value="">Select</option>{['CSE', 'CSE-DS', 'CSE-AI/ML', 'ECE', 'IOT/R&A', 'BBA'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div><label className="text-xs text-slate-400 mb-1 block">Email *</label><input type="email" value={form.email} onChange={(e) => u('email', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
        {!hod && <div><label className="text-xs text-slate-400 mb-1 block">Password *</label><input type="password" value={form.password} onChange={(e) => u('password', e.target.value)} placeholder="Min 12 chars, uppercase, lowercase, number, special" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none placeholder-slate-600" /></div>}
        {hod && <div><label className="text-xs text-slate-400 mb-1 block">Status</label>
          <select value={form.status} onChange={(e) => u('status', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none"><option value="active">Active</option><option value="disabled">Disabled</option></select></div>}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">{hod ? 'Save Changes' : 'Create HOD'}</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function ClubFormModal({ club, onSave, onClose }: { club?: any; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: club?.name || '', description: club?.description || '', status: club?.status || 'active' });
  return (
    <ModalWrapper title={club ? 'Edit Club' : 'Create Club'} onClose={onClose}>
      <div className="space-y-4">
        <div><label className="text-xs text-slate-400 mb-1 block">Club Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
        {club && <div><label className="text-xs text-slate-400 mb-1 block">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none"><option value="active">Active</option><option value="disabled">Disabled</option></select></div>}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">{club ? 'Save' : 'Create'}</button>
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
      <div className="space-y-4">
        {isStudent ? (
          <p className="text-sm text-slate-400">Password will be reset to the student's roll number. The student will be required to change it on next login.</p>
        ) : (
          <div><label className="text-xs text-slate-400 mb-1 block">New Password *</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min 12 chars" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" /></div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={() => onReset(pw)} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">Reset Password</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function TransferModal({ member, clubs, onTransfer, onClose }: { member: any; clubs: any[]; onTransfer: (clubId: number) => void; onClose: () => void }) {
  const [clubId, setClubId] = useState('');
  return (
    <ModalWrapper title={`Transfer — ${member.full_name}`} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-slate-400">Current club: <strong className="text-white">{member.club_name}</strong></p>
        <div><label className="text-xs text-slate-400 mb-1 block">New Club</label>
          <select value={clubId} onChange={(e) => setClubId(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none">
            <option value="">Select Club</option>{clubs.filter(c => c.id !== member.club_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-500">The member's faculty coordinators will automatically update to match the new club.</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={() => { if (clubId) onTransfer(parseInt(clubId)); }} disabled={!clubId} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors disabled:opacity-50">Transfer</button>
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
          <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 bg-white p-2 rounded-xl" />
        ) : (
          <div className="w-48 h-48 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-500">Generating...</div>
        )}
        <div className="text-center">
          <p className="text-lg font-bold text-white">{member.roll_number}</p>
          <p className="text-sm text-slate-400 mt-1">{member.member_id || member.uuid}</p>
        </div>
        <div className="flex w-full gap-3 pt-2">
          <button onClick={downloadQR} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Download
          </button>
          <button onClick={printQR} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
