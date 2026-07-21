import { formatYear } from '../utils/formatters';
import { useEffect, useState, useRef } from 'react';
import ISTTime from '../components/ISTTime';
import { PermissionTimer, formatISTTime } from '../components/ActiveTimer';
import { ClosePermissionModal } from '../components/ClosePermissionModal';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { Html5QrcodeScanner } from 'html5-qrcode';
import AttendanceReportForm from '../components/AttendanceReportForm';
import NotificationComposer from '../components/NotificationComposer';
import {
  ShieldCheck, LogOut, ClipboardList, Clock, CheckCircle2,
  XCircle, ChevronLeft, ChevronRight, FileText, User, Building2,
  Calendar, QrCode, Search, UserCheck, Play, ArrowRight, Eye,
  Maximize2, Users, ScrollText, Bell
} from 'lucide-react';

const getCurrentISTTimeStr = () => {
  return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
};

const calculateQuickOptions = (currentIST: string) => {
  const [hStr, mStr] = currentIST.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10);

  const addTime = (mins: number) => {
    let nh = h + Math.floor((m + mins) / 60);
    let nm = (m + mins) % 60;
    return `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}`;
  };

  const opts = [
    { label: '30 Minutes', time: addTime(30) },
    { label: '1 Hour', time: addTime(60) },
    { label: '2 Hours', time: addTime(120) },
    { label: 'Till Lunch', time: '13:00' },
    { label: 'Till 4:00 PM', time: '16:00' }
  ];

  return opts.map(o => ({
    ...o,
    disabled: o.time > '16:00' || o.time <= currentIST
  }));
};

export default function HODDashboard() {

  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  type TabKey = 'scanner' | 'directory' | 'active' | 'closed' | 'history' | 'reports' | 'notifications';
  const [activeTab, setActiveTab] = useState<TabKey>('scanner');
  
  // States
  const [permissions, setPermissions] = useState<any[]>([]);
  const [activePermissions, setActivePermissions] = useState<any[]>([]);
  const [closedPermissions, setClosedPermissions] = useState<any[]>([]);
  const [directory, setDirectory] = useState<any[]>([]);
  
  const [totalPermissions, setTotalPermissions] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalDirectory, setTotalDirectory] = useState(0);
  const [page, setPage] = useState(1);
  const [closeModal, setCloseModal] = useState<{ open: boolean; permission: any }>({ open: false, permission: null });

  const closePermission = async (reason: string, customRemark?: string) => {
    if (!closeModal.permission) return;
    try {
      const res = await apiCall(`/api/permissions/${closeModal.permission.id}/close`, { 
        method: 'POST',
        body: JSON.stringify({ close_reason: reason === 'Other' ? `Other: ${customRemark}` : reason })
      });
      if (res.ok) {
        toast('success', 'Permission closed successfully.');
        setCloseModal({ open: false, permission: null });
        loadActive();
        loadHistory();
      } else {
        const r = await res.json();
        toast('error', r.error || 'Failed to close permission.');
      }
    } catch (err: any) {
      console.error('Close Permission Error:', err);
      toast('error', 'Network error.');
    }
  };

  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Scanner & Member state
  const [scannedUuid, setScannedUuid] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [remark, setRemark] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [currentIST, setCurrentIST] = useState(getCurrentISTTimeStr());
  const [durationMode, setDurationMode] = useState<'quick' | 'custom'>('quick');

  useEffect(() => {
    const timer = setInterval(() => setCurrentIST(getCurrentISTTimeStr()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Side Panel state
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    let interval: any;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        pollData();
        interval = setInterval(pollData, 10000);
      } else {
        clearInterval(interval);
      }
    };

    if (document.visibilityState === 'visible') {
      pollData();
      interval = setInterval(pollData, 10000);
    }
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
    if (activeTab === 'history') loadHistory();
    if (activeTab === 'active') loadActive();
    if (activeTab === 'closed') loadClosed();
    if (activeTab === 'directory') loadDirectory();
  };

  const loadNotifications = async () => {
    try {
      const res = await apiCall('/api/notifications');
      if (res.ok) {
        const d = await res.json();
        setNotifications(d.notifications || []);
        setUnreadCount(d.unread_count || 0);
      }
    } catch { }
  };

  const markAllRead = async () => {
    await apiCall('/api/notifications/read-all', { method: 'PATCH' });
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read_status: 1 })));
  };

  const loadHistory = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '30' });
      if (filterDate) p.set('date', filterDate);
      if (user?.department) p.set('department', user.department);
      const res = await apiCall(`/api/permissions?${p}`);
      if (res.ok) {
        const d = await res.json();
        setPermissions(d.permissions || []);
        setTotalPermissions(d.total || 0);
      }
    } catch { }
  };

  const loadActive = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '50', status: 'granted' });
      if (user?.department) p.set('department', user.department);
      const res = await apiCall(`/api/permissions?${p}`);
      if (res.ok) {
        const d = await res.json();
        setActivePermissions((d.permissions || []).filter((p: any) => p.effective_status === 'active'));
      }
    } catch { }
  };

  const loadClosed = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '50', status: 'closed' });
      if (user?.department) p.set('department', user.department);
      if (filterDate) p.set('date', filterDate);
      const res = await apiCall(`/api/permissions?${p}`);
      if (res.ok) {
        const d = await res.json();
        setClosedPermissions(d.permissions || []);
      }
    } catch { }
  };

  const loadDirectory = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '30' });
      if (searchQuery) p.set('search', searchQuery);
      if (user?.department) p.set('department', user.department);
      const res = await apiCall(`/api/members?${p}`);
      if (res.ok) {
        const d = await res.json();
        setDirectory(d.members || []);
        setTotalDirectory(d.total || 0);
      }
    } catch { }
  };

  // QR Scanner Logic
  useEffect(() => {
    if (activeTab === 'scanner' && !scannedUuid) {
      if (!scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        scannerRef.current.render(onScanSuccess, onScanFailure);
      }
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [activeTab, scannedUuid]);

  const onScanSuccess = (decodedText: string) => {
    const parts = decodedText.split('/');
    const uuid = parts[parts.length - 1];
    if (uuid && uuid.length > 10) {
      setScannedUuid(uuid);
      fetchScannedData(uuid);
    }
  };
  const onScanFailure = () => {};

  const fetchScannedData = async (uuid: string) => {
    setScanLoading(true);
    try {
      const res = await apiCall(`/api/verify/${uuid}`);
      const data = await res.json();
      if (res.ok) {
        setScannedData(data);
      } else {
        toast('error', data.error || 'Failed to verify QR');
        setScannedUuid(null);
      }
    } catch {
      toast('error', 'Network error');
      setScannedUuid(null);
    }
    setScanLoading(false);
  };

  const handlePermission = async (status: 'granted' | 'rejected') => {
    if (!purpose.trim()) { toast('error', 'Purpose is required'); return; }
    try {
      const res = await apiCall('/api/permissions', {
        method: 'POST',
        body: JSON.stringify({ member_uuid: scannedUuid, purpose: purpose.trim(), remark: remark.trim() || null, expected_return_time: expectedReturnTime || null, status }),
      });
      const result = await res.json();
      if (res.ok) {
        toast('success', `Permission ${status}`);
        setScannedUuid(null);
        setScannedData(null);
        setPurpose(''); setRemark(''); setExpectedReturnTime('');
      } else {
        toast('error', result.error || 'Failed to process');
      }
    } catch { toast('error', 'Network error'); }
  };

  const resetScanner = () => {
    setScannedUuid(null);
    setScannedData(null);
    setPurpose(''); setRemark(''); setExpectedReturnTime('');
  };

  const tabs = [
    { id: 'scanner', label: 'QR Scanner', icon: QrCode },
    { id: 'directory', label: 'Student Directory', icon: Users },
    { id: 'active', label: 'Active Permissions', icon: Play },
    { id: 'closed', label: 'Closed', icon: CheckCircle2 },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'reports', label: 'Reports', icon: ScrollText },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-[var(--ia-bg)] font-sans flex flex-col">
      {closeModal.open && (
        <ClosePermissionModal
          permission={closeModal.permission}
          onConfirm={closePermission}
          onCancel={() => setCloseModal({ open: false, permission: null })}
        />
      )}
      {/* Side Panel for Student Profile */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedStudent(null)} />
          <div className="relative w-full max-w-md bg-[var(--ia-surface)] h-full shadow-2xl border-l border-[var(--ia-border)] flex flex-col">
            <div className="px-4 py-3 border-b border-[var(--ia-border)] flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[var(--ia-text)]">Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)} className="p-1.5 rounded-md hover:bg-[var(--ia-elevated)] text-[var(--ia-text-muted)] hover:text-[var(--ia-text)] transition-colors" aria-label="Close panel">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-[var(--ia-accent)]/15 flex items-center justify-center text-xl font-semibold text-[var(--ia-accent)] mx-auto mb-3">
                  {selectedStudent.full_name?.charAt(0)}
                </div>
                <h2 className="text-base font-semibold text-[var(--ia-text)]">{selectedStudent.full_name}</h2>
                <p className="text-[var(--ia-text-secondary)] font-mono text-sm mt-0.5">{selectedStudent.roll_number}</p>
                <span className={`text-[11px] px-2 py-0.5 rounded mt-2 inline-block font-medium ${selectedStudent.status === 'active' ? 'status-active' : 'status-inactive'}`}>{selectedStudent.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--ia-elevated)] rounded-md border border-[var(--ia-border)]"><p className="text-[11px] text-[var(--ia-text-muted)] uppercase tracking-wide">Department</p><p className="text-sm text-[var(--ia-text)] font-medium mt-0.5">{selectedStudent.department}</p></div>
                <div className="p-3 bg-[var(--ia-elevated)] rounded-md border border-[var(--ia-border)]"><p className="text-[11px] text-[var(--ia-text-muted)] uppercase tracking-wide">Year / Section</p><p className="text-sm text-[var(--ia-text)] font-medium mt-0.5">{formatYear(selectedStudent.year)} &middot; {selectedStudent.section}</p></div>
                <div className="p-3 bg-[var(--ia-elevated)] rounded-md border border-[var(--ia-border)] col-span-2"><p className="text-[11px] text-[var(--ia-text-muted)] uppercase tracking-wide">Club</p><p className="text-sm text-[var(--ia-accent)] font-medium mt-0.5">{selectedStudent.club_name || 'None'}</p></div>
              </div>
              <div className="pt-3 border-t border-[var(--ia-border)]">
                <button onClick={() => { setScannedUuid(selectedStudent.uuid); fetchScannedData(selectedStudent.uuid); setActiveTab('scanner'); setSelectedStudent(null); }} className="w-full py-2 rounded-md bg-[var(--ia-accent)] hover:bg-[var(--ia-accent-hover)] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Process Permission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[var(--ia-surface)] border-b border-[var(--ia-border)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--ia-accent)]/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[var(--ia-accent)]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[var(--ia-text)]">Infin8 Access</h1>
              <p className="text-[11px] text-[var(--ia-text-muted)] font-medium uppercase tracking-wider">Head of Department</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ISTTime />
            </div>
            <div className="hidden sm:block h-5 w-px bg-[var(--ia-border)]" />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-[var(--ia-text)]">{user?.name}</p>
              <p className="text-[11px] text-[var(--ia-text-muted)]">{user?.department} Dept</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="px-2.5 py-1.5 rounded-md bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] text-xs transition-colors flex items-center gap-1.5" aria-label="Logout">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4 space-y-4 flex-1 w-full">
        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-[var(--ia-border)] overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id as any); setPage(1); }}
              className={`flex items-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === t.id ? 'border-[var(--ia-accent)] text-[var(--ia-accent)]' : 'border-transparent text-[var(--ia-text-muted)] hover:text-[var(--ia-text-secondary)]'}`}>
              <t.icon className="w-3.5 h-3.5" /> <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* QR Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            {!scannedUuid ? (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden p-5">
                <div className="text-center mb-4">
                  <h2 className="text-base font-semibold text-[var(--ia-text)] mb-1">Scan Student QR</h2>
                  <p className="text-xs text-[var(--ia-text-muted)]">Position the student's digital Infin8 Access pass within the frame.</p>
                </div>
                <div className="rounded-md overflow-hidden border border-[var(--ia-border)] bg-black aspect-square max-w-sm mx-auto relative">
                  <div id="reader" className="w-full h-full" />
                </div>
                <div className="mt-4 text-center text-[11px] text-[var(--ia-text-muted)] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secured by Cloudflare D1
                </div>
              </div>
            ) : scanLoading ? (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-10 text-center">
                <div className="w-8 h-8 border-2 border-[var(--ia-accent)]/30 border-t-[var(--ia-accent)] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-[var(--ia-text-muted)]">Verifying Identity...</p>
              </div>
            ) : scannedData?.member ? (
              <div className="space-y-3 animate-fade-in">
                {/* Student Identity Card */}
                <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[var(--ia-accent)]/12 flex items-center justify-center text-lg font-semibold text-[var(--ia-accent)]">
                        {scannedData.member.name?.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--ia-text)]">{scannedData.member.name}</h2>
                        <p className="text-[var(--ia-text-secondary)] font-mono text-sm">{scannedData.member.roll_number}</p>
                      </div>
                    </div>
                    <button onClick={resetScanner} className="px-2.5 py-1 rounded-md bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] text-[var(--ia-text-muted)] hover:text-[var(--ia-text)] text-xs transition-colors flex items-center gap-1">
                      <Search className="w-3 h-3" /> Scan Another
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div><p className="text-[11px] text-[var(--ia-text-muted)] uppercase tracking-wide mb-0.5">Department</p><p className="text-[var(--ia-text)] text-sm">{scannedData.member.department}</p></div>
                    <div><p className="text-[11px] text-[var(--ia-text-muted)] uppercase tracking-wide mb-0.5">Year</p><p className="text-[var(--ia-text)] text-sm">{formatYear(scannedData.member.year)}</p></div>
                    <div><p className="text-[11px] text-[var(--ia-text-muted)] uppercase tracking-wide mb-0.5">Section</p><p className="text-[var(--ia-text)] text-sm">{scannedData.member.section}</p></div>
                    <div><p className="text-[11px] text-[var(--ia-text-muted)] uppercase tracking-wide mb-0.5">Club</p><p className="text-[var(--ia-accent)] text-sm font-medium">{scannedData.member.club}</p></div>
                  </div>
                </div>
                
                {/* Permission Status / Form */}
                {scannedData.today_permission && (
                  <div className={`bg-[var(--ia-surface)] border rounded-lg p-4 mb-6 ${scannedData.today_permission.effective_status === 'active' ? 'border-[var(--ia-success)]/25' : scannedData.today_permission.effective_status === 'closed' ? 'border-[var(--ia-info)]/25' : scannedData.today_permission.effective_status === 'expired' ? 'border-slate-500/25' : 'border-[var(--ia-danger)]/25'}`}>
                    <div className={`flex items-center gap-2 mb-2 font-semibold text-sm ${scannedData.today_permission.effective_status === 'active' ? 'text-[var(--ia-success)]' : scannedData.today_permission.effective_status === 'closed' ? 'text-[var(--ia-info)]' : scannedData.today_permission.effective_status === 'expired' ? 'text-slate-400' : 'text-[var(--ia-danger)]'}`}>
                      {scannedData.today_permission.effective_status === 'active' ? <CheckCircle2 className="w-4 h-4" /> : scannedData.today_permission.effective_status === 'closed' ? <CheckCircle2 className="w-4 h-4" /> : scannedData.today_permission.effective_status === 'expired' ? <Clock className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      Permission {scannedData.today_permission.effective_status ? scannedData.today_permission.effective_status.charAt(0).toUpperCase() + scannedData.today_permission.effective_status.slice(1) : (scannedData.today_permission.status || '').charAt(0).toUpperCase() + (scannedData.today_permission.status || '').slice(1)}
                    </div>
                    <p className="text-[var(--ia-text-secondary)] text-sm"><span className="text-[var(--ia-text-muted)]">Purpose:</span> {scannedData.today_permission.purpose}</p>
                    <p className="text-[var(--ia-text-muted)] text-xs mt-1"><span>Processed by:</span> {scannedData.today_permission.hod_name || 'Unknown'} at {scannedData.today_permission.time}</p>
                    {scannedData.today_permission.remark && <p className="text-[var(--ia-text-muted)] text-xs mt-1"><span>Remark:</span> {scannedData.today_permission.remark}</p>}
                    {scannedData.today_permission.expected_return_time && <p className="text-[var(--ia-text-muted)] text-xs mt-1"><span>Expected Return:</span> {scannedData.today_permission.expected_return_time}</p>}
                    
                    {scannedData.today_permission.effective_status === 'active' && (
                      <div className="mt-4 pt-4 border-t border-[var(--ia-border)] flex flex-col items-center">
                        <p className="text-sm text-[var(--ia-text-secondary)] mb-2">Currently Active</p>
                        <PermissionTimer permission={scannedData.today_permission} large />
                      </div>
                    )}
                  </div>
                )}
                
                {(!scannedData.today_permission || scannedData.today_permission.effective_status !== 'active') && (
                  <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5 space-y-3">
                    {currentIST >= '16:00' ? (
                      <div className="p-4 bg-[var(--ia-danger)]/8 border border-[var(--ia-danger)]/20 rounded-md text-center">
                        <Clock className="w-5 h-5 text-[var(--ia-danger)] mx-auto mb-2" />
                        <h3 className="text-sm font-semibold text-[var(--ia-danger)] mb-1">Permission Hours Ended</h3>
                        <p className="text-xs text-[var(--ia-text-secondary)]">New permissions can be granted on the next working day.</p>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-sm text-[var(--ia-text)] flex items-center gap-2"><ClipboardList className="w-4 h-4 text-[var(--ia-accent)]" /> Process Request</h3>
                        <div>
                          <label className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Purpose *</label>
                          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Club Meeting, Hackathon Prep" className="w-full px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors" />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Remark (Optional)</label>
                          <input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Additional notes..." className="w-full px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Expected Return *</label>
                            <div className="flex gap-1">
                              <button onClick={() => setDurationMode('quick')} className={`text-[11px] px-2 py-0.5 rounded transition-colors ${durationMode === 'quick' ? 'bg-[var(--ia-accent)]/15 text-[var(--ia-accent)]' : 'text-[var(--ia-text-muted)] hover:bg-[var(--ia-elevated)]'}`}>Quick</button>
                              <button onClick={() => setDurationMode('custom')} className={`text-[11px] px-2 py-0.5 rounded transition-colors ${durationMode === 'custom' ? 'bg-[var(--ia-accent)]/15 text-[var(--ia-accent)]' : 'text-[var(--ia-text-muted)] hover:bg-[var(--ia-elevated)]'}`}>Custom</button>
                            </div>
                          </div>
                          
                          {durationMode === 'quick' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                              {calculateQuickOptions(currentIST).map(opt => (
                                <button
                                  key={opt.label}
                                  onClick={() => setExpectedReturnTime(opt.time)}
                                  disabled={opt.disabled}
                                  className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left ${expectedReturnTime === opt.time ? 'bg-[var(--ia-accent)] text-white' : 'bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:bg-[var(--ia-border)] disabled:opacity-25 disabled:cursor-not-allowed'}`}
                                >
                                  <div className="flex flex-col">
                                    <span>{opt.label}</span>
                                    <span className={`text-[10px] ${expectedReturnTime === opt.time ? 'text-blue-200' : 'text-[var(--ia-text-muted)]'}`}>{opt.time}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input type="time" max="16:00" min={currentIST} value={expectedReturnTime} onChange={(e) => setExpectedReturnTime(e.target.value)} className="w-full px-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors" />
                          )}
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => handlePermission('granted')} disabled={!expectedReturnTime || expectedReturnTime > '16:00' || expectedReturnTime <= currentIST} className="flex-1 py-2 rounded-md bg-[var(--ia-success)] hover:bg-green-600 text-white text-sm font-medium disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Grant
                          </button>
                          <button onClick={() => handlePermission('rejected')} className="flex-1 py-2 rounded-md bg-[var(--ia-danger)] hover:bg-red-600 text-white text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Student Directory Tab */}
        {activeTab === 'directory' && (
          <div className="space-y-3 animate-fade-in">
            <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setPage(1); }} placeholder="Search students by name, roll number, or member ID..." />
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]">
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Student</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--ia-border)]">
                    {directory.map((m: any) => (
                      <tr key={m.id} className="hover:bg-[var(--ia-elevated)] transition-colors cursor-pointer" onClick={() => setSelectedStudent(m)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-[var(--ia-accent)]/12 flex items-center justify-center text-xs font-semibold text-[var(--ia-accent)]">{m.full_name?.charAt(0)}</div>
                            <div><p className="text-[var(--ia-text)] font-medium text-sm">{m.full_name}</p><p className="text-[11px] text-[var(--ia-text-muted)]">{m.roll_number} &middot; {m.department} &middot; {formatYear(m.year)} &middot; {m.section} &middot; {m.club_name}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded font-medium ${m.status === 'active' ? 'status-active' : m.status === 'suspended' ? 'status-inactive' : 'bg-slate-500/10 text-[var(--ia-text-muted)] border border-slate-500/15'}`}>{m.status}</span></td>
                        <td className="px-4 py-3"><button className="text-[var(--ia-accent)] hover:text-blue-400 text-xs font-medium flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></button></td>
                      </tr>
                    ))}
                    {directory.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--ia-text-muted)] text-sm">No students found.</td></tr>}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} total={totalDirectory} />
            </div>
          </div>
        )}

        {/* Active Permissions Tab */}
        {activeTab === 'active' && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[var(--ia-border)] flex items-center gap-2 bg-[var(--ia-elevated)]">
                <Play className="w-4 h-4 text-[var(--ia-accent)]" />
                <h3 className="font-semibold text-sm text-[var(--ia-text)]">Currently Outside</h3>
                <span className="text-[11px] text-[var(--ia-text-muted)] ml-auto">{activePermissions.length} active</span>
              </div>
              <div className="divide-y divide-[var(--ia-border)]">
                {activePermissions.map(p => {
                  const overdue = calculateOverdue(p.expected_return_time);
                  return (
                    <div key={p.id} className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[var(--ia-accent)]/12 flex items-center justify-center text-[var(--ia-accent)] font-semibold text-xs">{p.member_name?.charAt(0)}</div>
                        <div>
                          <p className="text-[var(--ia-text)] font-medium text-sm">{p.member_name}</p>
                          <p className="text-[11px] text-[var(--ia-text-muted)] font-mono">{p.roll_number} &middot; {p.department} &middot; {formatYear(p.year)} &middot; {p.section} &middot; {p.club_name}</p>
                          <p className="text-[11px] text-[var(--ia-text-muted)] mt-0.5">Purpose: {p.purpose}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-[11px] text-[var(--ia-text-muted)] uppercase">Departure</p>
                          <p className="text-xs text-[var(--ia-text)] font-medium">{p.approved_at ? formatISTTime(p.approved_at) : p.time}</p>
                        </div>
                        {p.expected_return_time && (
                          <div>
                            <p className="text-[11px] text-[var(--ia-text-muted)] uppercase">Expected</p>
                            <p className="text-xs text-[var(--ia-text)] font-medium">{p.expected_return_time}</p>
                          </div>
                        )}
                        {overdue > 0 && (
                          <div className="px-2 py-1 rounded bg-[var(--ia-danger)]/15 border border-[var(--ia-danger)]/25 text-[var(--ia-danger)] text-[11px] font-semibold">
                            OVERDUE {overdue}m
                          </div>
                        )}
                        <div>
                          <p className="text-[11px] text-[var(--ia-text-muted)] uppercase">Elapsed</p>
                          <p className="text-xs text-[var(--ia-text)] font-medium"><PermissionTimer permission={p} /></p>
                        </div>
                        <button 
                          onClick={() => setCloseModal({ open: true, permission: p })}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                        >
                          Close
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

        {/* Closed Permissions Tab */}
        {activeTab === 'closed' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--ia-text-secondary)] font-medium">Closed Today</span>
                <span className="text-[var(--ia-text-muted)]">{closedPermissions.length} students</span>
              </div>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-3 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]" />
            </div>

            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-[var(--ia-border)] flex items-center justify-between bg-[var(--ia-elevated)]">
                <h3 className="font-semibold text-sm text-[var(--ia-text)]">Closed Sessions</h3>
              </div>
              <div className="divide-y divide-[var(--ia-border)]">
                {closedPermissions.map(p => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-[var(--ia-elevated)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-[var(--ia-info)]/10 flex items-center justify-center">
                        <span className="font-semibold text-[var(--ia-info)]">{p.full_name?.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[var(--ia-text)]">{p.full_name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[var(--ia-text-secondary)] font-mono">{p.roll_number}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ia-border)] text-[var(--ia-text-secondary)]">{p.club_name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div><p className="text-[11px] text-[var(--ia-text-muted)] uppercase">Closed</p><p className="text-xs text-[var(--ia-text-secondary)] font-medium">{formatISTTime(p.closed_at || p.completed_at)}</p></div>
                      <div className="text-right">
                        <p className="text-[11px] text-[var(--ia-text-muted)] uppercase">Actual Duration</p>
                        <PermissionTimer permission={p} />
                      </div>
                    </div>
                  </div>
                ))}
                {closedPermissions.length === 0 && <p className="px-4 py-8 text-center text-[var(--ia-text-muted)] text-sm">No closed permissions found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <AttendanceReportForm userRole="hod" />
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fade-in">
            <NotificationComposer userRole="hod" department={user?.department} onSuccess={loadNotifications} />

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

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-3 py-1.5 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)]" />
            </div>
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[var(--ia-border)] bg-[var(--ia-elevated)]">
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Student</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Date/Time</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Details</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[var(--ia-border)]">
                    {permissions.map((p: any) => (
                      <tr key={p.id} className="hover:bg-[var(--ia-elevated)] transition-colors">
                        <td className="px-4 py-3"><p className="text-[var(--ia-text)] font-medium text-sm">{p.member_name}</p><p className="text-[11px] text-[var(--ia-text-muted)] font-mono">{p.roll_number} &middot; {p.department} &middot; {formatYear(p.year)} &middot; {p.section} &middot; {p.club_name}</p></td>
                        <td className="px-4 py-3 text-[var(--ia-text-secondary)]"><p className="text-xs">{p.date}</p><p className="text-[11px] text-[var(--ia-text-muted)]">{p.approved_at ? formatISTTime(p.approved_at) : p.time}</p></td>
                        <td className="px-4 py-3 text-xs space-y-0.5"><p className="text-[var(--ia-accent)]">{p.club_name}</p><p className="text-[var(--ia-text-muted)]">Purpose: {p.purpose}</p></td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${p.effective_status === 'active' ? 'status-granted' : p.effective_status === 'closed' ? 'bg-[var(--ia-info)]/10 text-[var(--ia-info)] border border-[var(--ia-info)]/15' : p.effective_status === 'expired' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/15' : 'status-rejected'}`}>
                            {p.effective_status ? p.effective_status.charAt(0).toUpperCase() + p.effective_status.slice(1) : (p.status || '').charAt(0).toUpperCase() + (p.status || '').slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} total={totalPermissions} />
            </div>
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

function Users_Icon(props: any) { return <User {...props} /> }
