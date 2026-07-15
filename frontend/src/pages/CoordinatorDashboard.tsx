import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import QRCode from 'qrcode';
import {
  Users, QrCode, LogOut, CheckCircle2, XCircle, Search,
  ChevronLeft, ChevronRight, User, Shield, ExternalLink,
  Download, Printer, Maximize2, LayoutDashboard, Play,
  ClipboardList, Bell
} from 'lucide-react';

export default function CoordinatorDashboard() {
  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'members' | 'qr' | 'active' | 'completed' | 'history' | 'notifications'>('members');
  
  // Data states
  const [members, setMembers] = useState<any[]>([]);
  const [activePermissions, setActivePermissions] = useState<any[]>([]);
  const [completedPermissions, setCompletedPermissions] = useState<any[]>([]);
  const [historyPermissions, setHistoryPermissions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  
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
  useEffect(() => {
    loadSettings();
  }, []);

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
      const p = new URLSearchParams({ page: String(page), limit: '30' });
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
    const now = new Date();
    const [h, m] = expectedTime.split(':').map(Number);
    const expected = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    if (now > expected) return Math.floor((now.getTime() - expected.getTime()) / 60000);
    return 0;
  };

  return (
    <div className="dark min-h-screen gradient-primary">
      {/* Fullscreen QR overlay */}
      {showFullscreenQR && qrDataUrl && (
        <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowFullscreenQR(false)}>
          <div className="text-center animate-scale-in">
            <img src={qrDataUrl} alt="QR Code" className="w-72 h-72 sm:w-96 sm:h-96 rounded-2xl shadow-2xl mx-auto bg-white p-4" />
            <p className="text-white font-bold text-lg mt-6">{selectedMember?.full_name}</p>
            <p className="text-slate-400 text-sm">{selectedMember?.roll_number} | {selectedMember?.member_id}</p>
            <p className="text-slate-500 text-xs mt-4">Tap anywhere to close</p>
          </div>
        </div>
      )}

      {/* Complete Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmCompleteId}
        title="Mark as Completed?"
        message="This will move the student from 'Currently Outside' to 'Completed'. They have finished their task."
        confirmText="Mark Completed"
        cancelText="Cancel"
        onConfirm={handleMarkCompleted}
        onCancel={() => setConfirmCompleteId(null)}
        isLoading={completing}
      />

      {/* Top Bar */}
      <header className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">Infin8 Access</h1>
              <p className="text-xs text-purple-400/80 font-medium tracking-wider uppercase">Faculty Coordinator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.club_name}</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 overflow-x-auto custom-scrollbar">
          {[
            { id: 'members', label: 'Members', icon: Users },
            { id: 'active', label: 'Active', icon: Play },
            { id: 'completed', label: 'Completed', icon: CheckCircle2 },
            { id: 'history', label: 'History', icon: ClipboardList },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'qr', label: 'QR', icon: QrCode },
          ].map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id as any); setPage(1); }} className={`flex items-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap px-4 flex-1 justify-center ${activeTab === t.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <t.icon className="w-4 h-4" /> <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4 animate-fade-in">
            <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setPage(1); }} placeholder="Search by student name or roll number..." />
            <p className="text-xs text-slate-500">{totalMembers} members found in {user?.club_name}</p>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Student</th>

                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {members.map((m: any) => (
                      <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 flex items-center justify-center text-xs font-bold text-white">{m.full_name?.charAt(0)}</div>
                            <div><p className="text-white font-medium">{m.full_name}</p><p className="text-xs text-slate-500">{m.roll_number} &middot; {m.department} &middot; Year {m.year} &middot; Section {m.section} &middot; {m.club_name || user?.club_name}</p></div>
                          </div>
                        </td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${m.status === 'active' ? 'status-active' : m.status === 'suspended' ? 'status-inactive' : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'}`}>{m.status || 'active'}</span></td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/verify/${m.uuid}`)} title="View Profile" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /></button>
                            <button onClick={() => generateQR(m)} title="View QR" className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors"><QrCode className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {members.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No members found.</td></tr>}
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
            <div className="glass-card rounded-2xl overflow-hidden border-purple-500/20 bg-purple-500/5">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white">Currently Outside</h3>
              </div>
              <div className="divide-y divide-white/5">
                {activePermissions.map(p => {
                  const overdue = calculateOverdue(p.expected_return_time);
                  return (
                    <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">{p.member_name?.charAt(0)}</div>
                        <div>
                          <p className="text-white font-medium">{p.member_name}</p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{p.roll_number} &middot; {p.department} &middot; Year {p.year} &middot; Section {p.section} &middot; {p.club_name || user?.club_name}</p>
                          <p className="text-xs text-slate-500 mt-1">Purpose: {p.purpose} &middot; Approved by {p.hod_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div><p className="text-xs text-slate-500 uppercase">Departure</p><p className="text-sm text-white font-medium">{p.time}</p></div>
                        {p.expected_return_time && (
                          <div><p className="text-xs text-slate-500 uppercase">Expected</p><p className="text-sm text-white font-medium">{p.expected_return_time}</p></div>
                        )}
                        {overdue > 0 && (
                          <div className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold animate-pulse">OVERDUE {overdue}m</div>
                        )}
                        <button onClick={() => setConfirmCompleteId(p.id)} className="ml-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm flex items-center gap-2 transition-colors">
                          <CheckCircle2 className="w-4 h-4" /> Mark Completed
                        </button>
                      </div>
                    </div>
                  );
                })}
                {activePermissions.length === 0 && <p className="p-8 text-center text-slate-500 text-sm">No active permissions found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Completed Permissions Tab */}
        {activeTab === 'completed' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3"><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" /></div>
            <div className="glass-card rounded-2xl overflow-hidden border-emerald-500/20">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">Completed Sessions</h3>
              </div>
              <div className="divide-y divide-white/5">
                {completedPermissions.map(p => (
                  <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">{p.member_name?.charAt(0)}</div>
                      <div>
                        <p className="text-white font-medium">{p.member_name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{p.roll_number} &middot; {p.department} &middot; Year {p.year} &middot; Section {p.section} &middot; {p.club_name || user?.club_name}</p>
                        <p className="text-xs text-slate-500 mt-1">Purpose: {p.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div><p className="text-xs text-slate-500 uppercase">Departure</p><p className="text-sm text-slate-300">{p.time}</p></div>
                      <div><p className="text-xs text-slate-500 uppercase">Completed At</p><p className="text-sm text-emerald-400 font-medium">{new Date(p.completed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p></div>
                    </div>
                  </div>
                ))}
                {completedPermissions.length === 0 && <p className="p-8 text-center text-slate-500 text-sm">No completed permissions found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3"><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" /></div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/5"><th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Student</th><th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Date/Time</th><th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Details</th><th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Status</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {historyPermissions.map((p: any) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="p-4"><p className="text-white font-medium">{p.member_name}</p><p className="text-xs text-slate-500 font-mono">{p.roll_number} &middot; {p.department} &middot; Year {p.year} &middot; Section {p.section} &middot; {p.club_name || user?.club_name}</p></td>
                        <td className="p-4 text-slate-300"><p className="text-xs">{p.date}</p><p className="text-xs text-slate-500">{p.time}</p></td>
                        <td className="p-4 text-xs space-y-1"><p className="text-slate-400">Purpose: {p.purpose}</p><p className="text-slate-500">Processed by {p.hod_name}</p></td>
                        <td className="p-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === 'granted' ? 'status-granted' : p.status === 'completed' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'status-rejected'}`}>
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} total={totalHistory} />
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl overflow-hidden border-yellow-500/20 bg-yellow-500/5 p-8 text-center">
              <Bell className="w-12 h-12 text-yellow-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Notifications Center</h3>
              <p className="text-slate-400">Your notifications will appear here when permissions are granted or updated.</p>
            </div>
          </div>
        )}

        {/* QR Management Tab */}
        {activeTab === 'qr' && (
          <div className="animate-fade-in">
            {!selectedMember ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Member Selected</h3>
                <p className="text-slate-400 text-sm mb-6">Select a member from the Members List to manage their QR code.</p>
                <button onClick={() => setActiveTab('members')} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors inline-flex items-center gap-2"><Users className="w-4 h-4" /> Go to Members List</button>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0"><div className="bg-white p-3 rounded-2xl"><img src={qrDataUrl} alt="QR Code" className="w-48 h-48 md:w-64 md:h-64 object-contain" /></div></div>
                <div className="flex-1 space-y-6 w-full text-center md:text-left">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedMember.full_name}</h2>
                    <p className="text-purple-300 font-mono mt-1">{selectedMember.roll_number}</p>
                    <p className="text-slate-400 text-sm mt-1">ID: {selectedMember.member_id}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button onClick={() => setShowFullscreenQR(true)} className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all"><Maximize2 className="w-5 h-5" /><span className="text-xs font-medium">Fullscreen</span></button>
                    <button onClick={downloadQR} className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all"><Download className="w-5 h-5" /><span className="text-xs font-medium">Download</span></button>
                    <button onClick={printQR} className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all"><Printer className="w-5 h-5" /><span className="text-xs font-medium">Print</span></button>
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
    <div className="p-4 border-t border-white/5 flex items-center justify-between">
      <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 disabled:opacity-30 transition-colors flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Prev</button>
      <span className="text-xs text-slate-500">Page {page}</span>
      <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition-colors flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
    </div>
  );
}
