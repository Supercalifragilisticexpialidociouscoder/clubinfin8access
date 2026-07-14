import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  LayoutDashboard, CreditCard, ClipboardList, User as UserIcon,
  Download, Maximize2, Printer, QrCode, LogOut, Clock, CheckCircle2,
  XCircle, AlertTriangle, Calendar, FileText, MessageSquare, Shield
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'clubpass' | 'permissions' | 'profile'>('overview');
  const [profile, setProfile] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showFullscreenQR, setShowFullscreenQR] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const clubpassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProfile();
    loadSettings();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await apiCall(`/api/members/${user?.id}/profile`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        generateQR(data.member.uuid);
      }
    } catch { }
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

  const generateQR = async (uuid: string) => {
    const prefix = settings.qr_url_prefix || 'https://clubpass.pages.dev/verify/';
    const url = `${prefix}${uuid}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 250,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
    setQrDataUrl(dataUrl);
  };

  const downloadQR = () => {
    if (!qrDataUrl || !profile) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `ClubPass-${profile.member.roll_number}-QR.png`;
    a.click();
    toast('success', 'QR code downloaded successfully.');
  };

  const downloadPDF = async () => {
    if (!clubpassRef.current || !profile) return;
    try {
      const canvas = await html2canvas(clubpassRef.current, { backgroundColor: '#0f172a', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgRatio = canvas.height / canvas.width;
      const pdfHeight = pdfWidth * imgRatio;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`ClubPass-${profile.member.roll_number}.pdf`);
      toast('success', 'PDF downloaded successfully.');
    } catch {
      toast('error', 'Failed to generate PDF.');
    }
  };

  const downloadPNG = async () => {
    if (!clubpassRef.current) return;
    try {
      const canvas = await html2canvas(clubpassRef.current, { backgroundColor: '#0f172a', scale: 2 });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `ClubPass-${profile.member.roll_number}.png`;
      a.click();
      toast('success', 'ClubPass image downloaded.');
    } catch {
      toast('error', 'Failed to generate image.');
    }
  };

  const printQR = () => {
    if (!qrDataUrl) return;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<html><body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
        <div style="text-align:center;">
          <h2>${profile?.member?.name}</h2>
          <p>${profile?.member?.roll_number} | ${profile?.member?.member_id}</p>
          <img src="${qrDataUrl}" style="width:300px;height:300px;" />
          <p style="font-size:12px;color:#666;">ClubPass v1.2</p>
        </div>
      </body></html>`);
      w.document.close();
      w.print();
    }
  };

  const m = profile?.member;
  const collegeName = settings.college_name || 'Malla Reddy Technical Campus';

  const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'clubpass', label: 'ClubPass', icon: CreditCard },
    { key: 'permissions', label: 'Permissions', icon: ClipboardList },
    { key: 'profile', label: 'Profile', icon: UserIcon },
  ] as const;

  return (
    <div className="dark min-h-screen gradient-primary">
      {/* Fullscreen QR overlay */}
      {showFullscreenQR && qrDataUrl && (
        <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowFullscreenQR(false)}>
          <div className="text-center animate-scale-in">
            <img src={qrDataUrl} alt="QR Code" className="w-72 h-72 sm:w-96 sm:h-96 rounded-2xl shadow-2xl mx-auto" />
            <p className="text-white font-bold text-lg mt-4">{m?.name}</p>
            <p className="text-slate-400 text-sm">{m?.roll_number} | {m?.member_id}</p>
            <p className="text-slate-500 text-xs mt-2">Tap anywhere to close</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">ClubPass</h1>
              <p className="text-xs text-slate-500">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.club_name}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap px-3 flex items-center justify-center gap-2 ${activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && m && (
          <div className="space-y-5 animate-fade-in">
            {/* Quick identity */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {m.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">{m.name}</h2>
                  <p className="text-blue-300 font-mono text-sm">{m.roll_number}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                      {m.status}
                    </span>
                    <span className="text-xs text-slate-500">{m.member_id}</span>
                  </div>
                </div>
                {qrDataUrl && (
                  <button onClick={() => setShowFullscreenQR(true)} className="shrink-0">
                    <img src={qrDataUrl} alt="QR" className="w-16 h-16 rounded-lg border border-white/10 hover:border-blue-500/40 transition-colors" />
                  </button>
                )}
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoCard label="Department" value={m.department} />
              <InfoCard label="Year / Section" value={`Year ${m.year} — ${m.section}`} />
              <InfoCard label="Club" value={m.club} />
              <InfoCard label="Position" value={m.position || 'Member'} />
            </div>

            {/* Faculty coordinators */}
            {profile.coordinators?.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Faculty Coordinators</p>
                <div className="space-y-2">
                  {profile.coordinators.map((fc: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-7 h-7 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center text-xs font-bold">
                        {fc.name?.charAt(0)}
                      </span>
                      <div>
                        <span className="text-slate-200">{fc.name}</span>
                        <span className="text-slate-500 text-xs ml-2">{fc.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ClubPass Tab */}
        {activeTab === 'clubpass' && m && (
          <div className="space-y-5 animate-fade-in">
            {/* Digital ClubPass Card */}
            <div ref={clubpassRef} className="glass-card rounded-2xl overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/20 px-6 py-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">{collegeName}</p>
                    <h3 className="text-lg font-bold text-white mt-0.5">ClubPass</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-start gap-5">
                  {/* Photo */}
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-24 h-24 rounded-xl object-cover ring-2 ring-white/10" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white ring-2 ring-white/10">
                      {m.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">{m.name}</h3>
                    <p className="text-blue-300 font-mono text-sm mt-0.5">{m.roll_number}</p>
                    <p className="text-xs text-slate-400 mt-1">{m.member_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Department</p>
                    <p className="text-sm text-slate-200 mt-0.5">{m.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Year / Section</p>
                    <p className="text-sm text-slate-200 mt-0.5">Year {m.year} — {m.section}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Club</p>
                    <p className="text-sm text-blue-300 font-medium mt-0.5">{m.club}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Position</p>
                    <p className="text-sm text-slate-200 mt-0.5">{m.position || 'Member'}</p>
                  </div>
                </div>

                {/* Faculty coordinators */}
                {profile.coordinators?.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500 uppercase mb-2">Faculty Coordinators</p>
                    <div className="space-y-1">
                      {profile.coordinators.map((fc: any, i: number) => (
                        <p key={i} className="text-sm text-slate-300">{fc.name}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* QR Code */}
                {qrDataUrl && (
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500 uppercase mb-2">QR Code</p>
                    <div className="flex flex-col items-center">
                      <img src={qrDataUrl} alt="Student QR" className="w-40 h-40 rounded-xl bg-white p-2" />
                      <p className="text-sm font-medium text-slate-200 mt-3">{profile.member.member_id}</p>
                      <p className="text-xs text-green-400 font-medium uppercase tracking-wider mt-1">{profile.member.status || 'Active'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ActionButton icon={Maximize2} label="View QR" onClick={() => setShowFullscreenQR(true)} />
              <ActionButton icon={Download} label="Download QR (PNG)" onClick={downloadQR} />
              <ActionButton icon={QrCode} label="Fullscreen QR" onClick={() => setShowFullscreenQR(true)} />
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-white">Permission History</h3>
              </div>
              {!profile?.permissions?.length ? (
                <p className="p-8 text-center text-slate-500 text-sm">No permission records found.</p>
              ) : (
                <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
                  {profile.permissions.map((p: any) => {
                    let overdueMin = 0;
                    if (p.expected_return_time && p.status === 'granted') {
                      const now = new Date();
                      const today = now.toISOString().split('T')[0];
                      if (p.date === today) {
                        const [h, min] = p.expected_return_time.split(':').map(Number);
                        const expected = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, min);
                        if (now > expected) overdueMin = Math.floor((now.getTime() - expected.getTime()) / 60000);
                      }
                    }
                    return (
                      <div key={p.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              p.status === 'granted' ? 'bg-emerald-500/15' : 'bg-red-500/15'
                            }`}>
                              {p.status === 'granted' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                            </div>
                            <div>
                              <p className="text-sm text-white font-medium">
                                {p.status === 'granted' ? 'Permission Granted' : 'Permission Rejected'}
                              </p>
                              <p className="text-xs text-slate-500">{p.date} at {p.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {overdueMin > 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Overdue {overdueMin}m
                              </span>
                            )}
                          </div>
                        </div>
                        {(p.purpose || p.remark || p.expected_return_time) && (
                          <div className="mt-2 ml-11 space-y-1 text-xs">
                            {p.purpose && <p className="text-slate-400"><span className="text-slate-500">Purpose:</span> {p.purpose}</p>}
                            {p.remark && <p className="text-slate-400"><span className="text-slate-500">Remark:</span> {p.remark}</p>}
                            {p.expected_return_time && <p className="text-slate-400"><span className="text-slate-500">Expected Return:</span> {p.expected_return_time}</p>}
                            {p.hod_name && <p className="text-slate-400"><span className="text-slate-500">Approved By:</span> {p.hod_name}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && m && (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Member Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <ProfileField label="Full Name" value={m.name} />
                <ProfileField label="Roll Number" value={m.roll_number} />
                <ProfileField label="Member ID" value={m.member_id} />
                <ProfileField label="Email" value={m.email || 'N/A'} />
                <ProfileField label="Department" value={m.department} />
                <ProfileField label="Year" value={`Year ${m.year}`} />
                <ProfileField label="Section" value={m.section} />
                <ProfileField label="Club" value={m.club} />
                <ProfileField label="Position" value={m.position || 'Member'} />
                <ProfileField label="Status" value={m.status} />
              </div>
            </div>

            {/* Activity Timeline */}
            {profile.activities?.length > 0 && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Activity Timeline</h3>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                  {profile.activities.map((a: any, i: number) => (
                    <div key={a.id || i} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-300 line-clamp-2">{a.details}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(a.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 pb-4">ClubPass v1.2</p>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <p className="text-xs text-slate-500 uppercase">{label}</p>
      <p className="text-sm text-white font-medium mt-1 truncate">{value || '—'}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: typeof Download; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 justify-center py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all hover:bg-white/[0.08]"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5">{value || '—'}</p>
    </div>
  );
}
