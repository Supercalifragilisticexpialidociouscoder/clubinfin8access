import { formatYear } from '../utils/formatters';
import { useEffect, useState, useRef } from 'react';
import ISTTime from '../components/ISTTime';
import { ThemeToggle } from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  LayoutDashboard, CreditCard,
  Download, Maximize2, Printer, QrCode, LogOut, Shield
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'clubpass'>('overview');
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
    a.download = `Infin8Access-${profile.member.roll_number}-QR.png`;
    a.click();
    toast('success', 'QR code downloaded successfully.');
  };

  const downloadPDF = async () => {
    if (!clubpassRef.current || !profile) return;
    try {
      const canvas = await html2canvas(clubpassRef.current, { backgroundColor: '#ffffff', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgRatio = canvas.height / canvas.width;
      const pdfHeight = pdfWidth * imgRatio;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Infin8Access-${profile.member.roll_number}.pdf`);
      toast('success', 'PDF downloaded successfully.');
    } catch {
      toast('error', 'Failed to generate PDF.');
    }
  };

  const downloadPNG = async () => {
    if (!clubpassRef.current) return;
    try {
      const canvas = await html2canvas(clubpassRef.current, { backgroundColor: '#ffffff', scale: 2 });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `Infin8Access-${profile.member.roll_number}.png`;
      a.click();
      toast('success', 'Infin8 Access image downloaded.');
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
          <p style="font-size:12px;color:#666;">Infin8 Access v1.2</p>
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
    { key: 'clubpass', label: 'Infin8 Access', icon: CreditCard },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--ia-bg)] flex flex-col">
      {/* Fullscreen QR overlay */}
      {showFullscreenQR && qrDataUrl && (
        <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowFullscreenQR(false)}>
          <div className="text-center animate-scale-in">
            <img src={qrDataUrl} alt="QR Code" className="w-72 h-72 sm:w-96 sm:h-96 rounded-lg shadow-2xl mx-auto bg-white p-4" />
            <p className="text-white font-semibold text-lg mt-6">{m?.name}</p>
            <p className="text-[var(--ia-text-muted)] text-sm">{m?.roll_number} | {m?.member_id}</p>
            <p className="text-[var(--ia-text-secondary)] text-xs mt-4">Tap anywhere to close</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[var(--ia-surface)] border-b border-[var(--ia-border)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--ia-accent)]/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[var(--ia-accent)]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[var(--ia-text)]">Infin8 Access</h1>
              <p className="text-[11px] text-[var(--ia-text-muted)] font-medium uppercase tracking-wider">Student Portal</p>
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
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-2.5 py-1.5 rounded-md bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] text-xs transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4 flex-1 w-full">
        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-[var(--ia-border)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap border-b-2 flex-1 justify-center sm:flex-none ${activeTab === tab.key
                  ? 'border-[var(--ia-accent)] text-[var(--ia-accent)]'
                  : 'border-transparent text-[var(--ia-text-muted)] hover:text-[var(--ia-text-secondary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && m && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick identity */}
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-md bg-[var(--ia-accent)]/10 flex items-center justify-center text-xl font-semibold text-[var(--ia-accent)]">
                  {m.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-[var(--ia-text)] truncate">{m.name}</h2>
                  <p className="text-[var(--ia-text-secondary)] font-mono text-sm mt-0.5">{m.roll_number}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide ${m.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                      {m.status}
                    </span>
                    <span className="text-[11px] text-[var(--ia-text-muted)]">{m.member_id}</span>
                  </div>
                </div>
                {qrDataUrl && (
                  <button onClick={() => setShowFullscreenQR(true)} className="shrink-0 group">
                    <img src={qrDataUrl} alt="QR" className="w-14 h-14 rounded bg-white p-1 border border-[var(--ia-border)] group-hover:border-[var(--ia-accent)] transition-colors" />
                  </button>
                )}
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <InfoCard label="Department" value={m.department} />
              <InfoCard label="Year" value={formatYear(m.year)} />
              <InfoCard label="Section" value={m.section} />
              <InfoCard label="Club" value={m.club} />
              <InfoCard label="Position" value={m.position || 'Member'} />
            </div>

            {/* Faculty coordinators */}
            {profile.coordinators?.length > 0 && (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
                <p className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-3">Faculty Coordinators</p>
                <div className="space-y-3">
                  {profile.coordinators.map((fc: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-md bg-[var(--ia-info)]/15 text-[var(--ia-info)] flex items-center justify-center text-xs font-semibold">
                        {fc.name?.charAt(0)}
                      </span>
                      <div>
                        <span className="text-[13px] text-[var(--ia-text)] font-medium block leading-tight">{fc.name}</span>
                        <span className="text-[var(--ia-text-muted)] text-[11px]">{fc.email}</span>
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
          <div className="space-y-4 animate-fade-in">
            {/* Digital ClubPass Card */}
            <div ref={clubpassRef} className="bg-white rounded-xl overflow-hidden shadow-sm max-w-sm mx-auto border border-gray-200">
              {/* Card Header */}
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">{collegeName}</p>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">Infin8 Access</h3>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-600 border border-blue-100">
                      {m.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{m.name}</h3>
                    <p className="text-gray-600 font-mono text-sm mt-0.5">{m.roll_number}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{m.member_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-5">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Department</p>
                    <p className="text-[13px] text-gray-900 font-medium mt-0.5">{m.department}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Year & Sec</p>
                    <p className="text-[13px] text-gray-900 font-medium mt-0.5">{formatYear(m.year)} &middot; {m.section}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Club</p>
                    <p className="text-[13px] text-blue-600 font-bold mt-0.5">{m.club}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Position</p>
                    <p className="text-[13px] text-gray-900 font-medium mt-0.5">{m.position || 'Member'}</p>
                  </div>
                </div>

                {/* QR Code */}
                {qrDataUrl && (
                  <div className="mt-5 pt-4 border-t border-gray-100 flex gap-4 items-center">
                    <img src={qrDataUrl} alt="Student QR" className="w-24 h-24 rounded-lg bg-white p-1 border border-gray-200" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Scan to verify</p>
                      <p className="text-xs font-mono text-gray-700">{profile.member.member_id}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 inline-block px-1.5 py-0.5 rounded ${profile.member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{profile.member.status || 'Active'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-sm mx-auto">
              <ActionButton icon={Maximize2} label="View QR" onClick={() => setShowFullscreenQR(true)} />
              <ActionButton icon={QrCode} label="Save QR" onClick={downloadQR} />
              <ActionButton icon={Download} label="Save Card" onClick={downloadPNG} />
              <ActionButton icon={Printer} label="Print" onClick={printQR} />
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[11px] text-[var(--ia-text-muted)] pb-4">Infin8 Access v1.2</p>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-3">
      <p className="text-[10px] text-[var(--ia-text-muted)] uppercase tracking-wide">{label}</p>
      <p className="text-sm text-[var(--ia-text)] font-semibold mt-1 truncate">{value || '—'}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: typeof Download; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] transition-all"
    >
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[var(--ia-text-muted)] uppercase tracking-wide">{label}</p>
      <p className="text-[13px] text-[var(--ia-text)] font-medium mt-0.5">{value || '—'}</p>
    </div>
  );
}
