import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  ShieldCheck, LogOut, ClipboardList, Clock, CheckCircle2,
  XCircle, ChevronLeft, ChevronRight, FileText, User, Building2,
  Calendar, QrCode, Search, UserCheck, Play, ArrowRight, Eye,
  Maximize2
} from 'lucide-react';

export default function HODDashboard() {
  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'scanner' | 'directory' | 'active' | 'completed' | 'history'>('scanner');
  
  // States
  const [permissions, setPermissions] = useState<any[]>([]);
  const [activePermissions, setActivePermissions] = useState<any[]>([]);
  const [completedPermissions, setCompletedPermissions] = useState<any[]>([]);
  const [directory, setDirectory] = useState<any[]>([]);
  
  const [totalPermissions, setTotalPermissions] = useState(0);
  const [totalDirectory, setTotalDirectory] = useState(0);
  const [page, setPage] = useState(1);
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

  // Side Panel state
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

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
    if (activeTab === 'history') loadHistory();
    if (activeTab === 'active') loadActive();
    if (activeTab === 'completed') loadCompleted();
    if (activeTab === 'directory') loadDirectory();
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
        setActivePermissions(d.permissions || []);
      }
    } catch { }
  };

  const loadCompleted = async () => {
    try {
      const p = new URLSearchParams({ page: String(page), limit: '50', status: 'completed' });
      if (user?.department) p.set('department', user.department);
      if (filterDate) p.set('date', filterDate);
      const res = await apiCall(`/api/permissions?${p}`);
      if (res.ok) {
        const d = await res.json();
        setCompletedPermissions(d.permissions || []);
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
    // Expecting URL like https://clubpass.com/verify/UUID
    const parts = decodedText.split('/');
    const uuid = parts[parts.length - 1];
    if (uuid && uuid.length > 10) {
      setScannedUuid(uuid);
      fetchScannedData(uuid);
    }
  };
  const onScanFailure = () => {}; // Ignore regular scan failures while searching

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

  // Helper for overdue calculations
  const calculateOverdue = (expectedTime: string) => {
    if (!expectedTime) return 0;
    const now = new Date();
    const [h, m] = expectedTime.split(':').map(Number);
    const expected = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    if (now > expected) return Math.floor((now.getTime() - expected.getTime()) / 60000);
    return 0;
  };

  return (
    <div className="dark min-h-screen gradient-primary flex flex-col">
      {/* Side Panel for Student Profile */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0f172a] h-full shadow-2xl border-l border-white/10 animate-slide-left flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="font-bold text-white">Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-2 ring-emerald-500/30 mx-auto mb-4">
                  {selectedStudent.full_name?.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-white">{selectedStudent.full_name}</h2>
                <p className="text-emerald-300 font-mono mt-1">{selectedStudent.roll_number}</p>
                <span className={`text-xs px-2.5 py-0.5 rounded-full mt-2 inline-block ${selectedStudent.status === 'active' ? 'status-active' : 'status-inactive'}`}>{selectedStudent.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5"><p className="text-xs text-slate-500 uppercase">Department</p><p className="text-sm text-white font-medium mt-1">{selectedStudent.department}</p></div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5"><p className="text-xs text-slate-500 uppercase">Year / Section</p><p className="text-sm text-white font-medium mt-1">Year {selectedStudent.year} &middot; {selectedStudent.section}</p></div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 col-span-2"><p className="text-xs text-slate-500 uppercase">Club Assignment</p><p className="text-sm text-blue-300 font-medium mt-1">{selectedStudent.club_name || 'None'}</p></div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <button onClick={() => { setScannedUuid(selectedStudent.uuid); fetchScannedData(selectedStudent.uuid); setActiveTab('scanner'); setSelectedStudent(null); }} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium shadow-lg hover:from-emerald-500 hover:to-teal-400 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Process Permission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">ClubPass</h1>
              <p className="text-xs text-emerald-400/80 font-medium tracking-wider uppercase">Head of Department</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.department} Dept</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 flex-1 w-full">
        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 overflow-x-auto custom-scrollbar">
          {[
            { id: 'scanner', label: 'QR Scanner', icon: QrCode },
            { id: 'directory', label: 'Student Directory', icon: Users_Icon },
            { id: 'active', label: 'Active Permissions', icon: Play },
            { id: 'completed', label: 'Completed', icon: CheckCircle2 },
            { id: 'history', label: 'History Logs', icon: ClipboardList }
          ].map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id as any); setPage(1); }} className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <t.icon className="w-4 h-4" /> <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* QR Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            {!scannedUuid ? (
              <div className="glass-card rounded-2xl overflow-hidden p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Scan Student QR</h2>
                  <p className="text-sm text-slate-400">Position the student's digital ClubPass within the frame.</p>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black aspect-square max-w-md mx-auto relative">
                  <div id="reader" className="w-full h-full" />
                </div>
                <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Identity verification happens securely via Cloudflare D1.
                </div>
              </div>
            ) : scanLoading ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Verifying Identity...</p>
              </div>
            ) : scannedData?.member ? (
              <div className="space-y-4 animate-slide-up">
                <div className="glass-card rounded-2xl p-6 border-emerald-500/30">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {scannedData.member.name?.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{scannedData.member.name}</h2>
                        <p className="text-emerald-300 font-mono">{scannedData.member.roll_number}</p>
                      </div>
                    </div>
                    <button onClick={resetScanner} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors flex items-center gap-1">
                      <Search className="w-3.5 h-3.5" /> Scan Another
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div><p className="text-xs text-slate-500 uppercase mb-0.5">Department</p><p className="text-white">{scannedData.member.department} &middot; Yr {scannedData.member.year}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase mb-0.5">Club</p><p className="text-blue-300 font-medium">{scannedData.member.club}</p></div>
                  </div>
                  
                  {scannedData.today_permission ? (
                    <div className={`p-4 rounded-xl border ${scannedData.today_permission.status === 'granted' ? 'bg-emerald-500/10 border-emerald-500/20' : scannedData.today_permission.status === 'completed' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <h4 className={`font-bold mb-2 flex items-center gap-2 ${scannedData.today_permission.status === 'granted' ? 'text-emerald-400' : scannedData.today_permission.status === 'completed' ? 'text-blue-400' : 'text-red-400'}`}>
                        {scannedData.today_permission.status === 'granted' ? <CheckCircle2 className="w-5 h-5" /> : scannedData.today_permission.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        Permission {scannedData.today_permission.status}
                      </h4>
                      <p className="text-slate-300 text-sm mb-1"><span className="text-slate-500">Purpose:</span> {scannedData.today_permission.purpose}</p>
                      <p className="text-slate-400 text-xs"><span className="text-slate-500">Processed by:</span> {scannedData.today_permission.approved_by} at {scannedData.today_permission.time}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <h3 className="font-bold text-white flex items-center gap-2"><ClipboardList className="w-5 h-5 text-emerald-400" /> Process Request</h3>
                      <div>
                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Purpose *</label>
                        <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Club Meeting, Hackathon Prep" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Remark (Optional)</label>
                        <input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Additional notes..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Expected Return Time (Optional)</label>
                        <input type="time" value={expectedReturnTime} onChange={(e) => setExpectedReturnTime(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => handlePermission('granted')} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold hover:from-emerald-500 hover:to-green-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Approve
                        </button>
                        <button onClick={() => handlePermission('rejected')} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold hover:from-red-500 hover:to-rose-400 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                          <XCircle className="w-5 h-5" /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Student Directory Tab */}
        {activeTab === 'directory' && (
          <div className="space-y-4 animate-fade-in">
            <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setPage(1); }} placeholder="Search students by name, roll number, or member ID..." />
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Student</th>
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Roll Number</th>
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Club</th>
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {directory.map((m: any) => (
                      <tr key={m.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedStudent(m)}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">{m.full_name?.charAt(0)}</div>
                            <div><p className="text-white font-medium">{m.full_name}</p><p className="text-xs text-slate-500 md:hidden">{m.roll_number}</p></div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300 font-mono hidden md:table-cell">{m.roll_number}</td>
                        <td className="p-4 text-slate-400 hidden md:table-cell">{m.club_name || 'N/A'}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${m.status === 'active' ? 'status-active' : 'status-inactive'}`}>{m.status}</span></td>
                        <td className="p-4"><button className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></button></td>
                      </tr>
                    ))}
                    {directory.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No students found.</td></tr>}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} total={totalDirectory} />
            </div>
          </div>
        )}

        {/* Active Permissions Tab */}
        {activeTab === 'active' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl overflow-hidden border-blue-500/20 bg-blue-500/5">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Currently Outside</h3>
              </div>
              <div className="divide-y divide-white/5">
                {activePermissions.map(p => {
                  const overdue = calculateOverdue(p.expected_return_time);
                  return (
                    <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">{p.member_name?.charAt(0)}</div>
                        <div>
                          <p className="text-white font-medium">{p.member_name} <span className="text-blue-300 font-mono ml-2 text-sm">{p.roll_number}</span></p>
                          <p className="text-xs text-slate-400 mt-1">Club: {p.club_name} &middot; Purpose: {p.purpose}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Departure</p>
                          <p className="text-sm text-white font-medium">{p.time}</p>
                        </div>
                        {p.expected_return_time && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase">Expected</p>
                            <p className="text-sm text-white font-medium">{p.expected_return_time}</p>
                          </div>
                        )}
                        {overdue > 0 && (
                          <div className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold animate-pulse">
                            OVERDUE {overdue}m
                          </div>
                        )}
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
            <div className="flex items-center gap-3"><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" /></div>
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
                        <p className="text-white font-medium">{p.member_name} <span className="text-emerald-300 font-mono ml-2 text-sm">{p.roll_number}</span></p>
                        <p className="text-xs text-slate-400 mt-1">Club: {p.club_name} &middot; Purpose: {p.purpose}</p>
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
            <div className="flex items-center gap-3"><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" /></div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/5"><th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Student</th><th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Date/Time</th><th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Details</th><th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Status</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {permissions.map((p: any) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="p-4"><p className="text-white font-medium">{p.member_name}</p><p className="text-xs text-slate-500 font-mono">{p.roll_number}</p></td>
                        <td className="p-4 text-slate-300"><p className="text-xs">{p.date}</p><p className="text-xs text-slate-500">{p.time}</p></td>
                        <td className="p-4 text-xs space-y-1"><p className="text-blue-300">{p.club_name}</p><p className="text-slate-400">Purpose: {p.purpose}</p></td>
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
    <div className="p-4 border-t border-white/5 flex items-center justify-between">
      <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 disabled:opacity-30 transition-colors flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Prev</button>
      <span className="text-xs text-slate-500">Page {page}</span>
      <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition-colors flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
    </div>
  );
}

function Users_Icon(props: any) { return <User {...props} /> } // Helper mapping
