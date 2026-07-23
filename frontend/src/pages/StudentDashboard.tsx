import { formatYear } from '../utils/formatters';
import { useEffect, useState, useRef } from 'react';
import ISTTime from '../components/ISTTime';
import { ThemeToggle } from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import {
  LayoutDashboard, CreditCard,
  Download, Maximize2, Printer, QrCode, LogOut, Shield,
  UserCheck, Clock, FileText, CheckCircle2, XCircle, AlertCircle, Sparkles, Camera
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'clubpass'>('overview');
  const [profile, setProfile] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showFullscreenQR, setShowFullscreenQR] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const clubpassRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadProfile(), loadSettings()]);
    setIsLoading(false);
  };

  const loadProfile = async () => {
    try {
      const res = await apiCall(`/api/members/${user?.id}/profile`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (data.member?.uuid) {
          generateQR(data.member.uuid);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await apiCall('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || {});
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const generateQR = async (uuid: string) => {
    const prefix = settings.qr_url_prefix || 'https://clubpass.pages.dev/verify/';
    const url = `${prefix}${uuid}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    });
    setQrDataUrl(dataUrl);
  };

  const downloadQR = async () => {
    if (!profile?.member?.uuid || isExporting) return;
    setIsExporting(true);
    try {
      const prefix = settings.qr_url_prefix || 'https://clubpass.pages.dev/verify/';
      const url = `${prefix}${profile.member.uuid}`;
      const highResDataUrl = await QRCode.toDataURL(url, {
        width: 1024,
        margin: 4,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      const a = document.createElement('a');
      a.href = highResDataUrl;
      a.download = `Infin8Access-${profile.member.roll_number}-QR.png`;
      a.click();
      toast('success', 'QR code downloaded successfully.');
    } catch (err) {
      toast('error', 'Failed to generate QR code.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPDF = async () => {
    if (!clubpassRef.current || !profile || isExporting) return;
    setIsExporting(true);
    try {
      const node = clubpassRef.current;
      const options = {
        pixelRatio: 3,
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: { 
          transform: 'none',
          margin: '0'
        }
      };
      const imgData = await htmlToImage.toPng(node, options);
      const canvas = await htmlToImage.toCanvas(node, options);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgRatio = canvas.height / canvas.width;
      const pdfHeight = pdfWidth * imgRatio;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Infin8Access-${profile.member.roll_number}.pdf`);
      toast('success', 'PDF downloaded successfully.');
    } catch (err) {
      console.error(err);
      toast('error', 'Failed to generate PDF. Ensure images are loaded.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPNG = async () => {
    if (!clubpassRef.current || !profile || isExporting) return;
    setIsExporting(true);
    try {
      const node = clubpassRef.current;
      const options = {
        pixelRatio: 3,
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: { 
          transform: 'none',
          margin: '0'
        }
      };
      const imgData = await htmlToImage.toPng(node, options);
      const a = document.createElement('a');
      a.href = imgData;
      a.download = `Infin8Access-${profile.member.roll_number}.png`;
      a.click();
      toast('success', 'Infin8 Access image downloaded.');
    } catch (err) {
      console.error(err);
      toast('error', 'Failed to generate image. Ensure images are loaded.');
    } finally {
      setIsExporting(false);
    }
  };

  const printQR = () => {
    if (!qrDataUrl || !profile) return;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<html><body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;font-family:system-ui,-apple-system,sans-serif;">
        <div style="text-align:center;padding:24px;border:1px solid #e2e8f0;border-radius:12px;max-width:320px;">
          <h2 style="margin:0 0 4px 0;font-size:18px;color:#0f172a;">${profile?.member?.full_name || profile?.member?.name}</h2>
          <p style="margin:0 0 16px 0;font-size:13px;color:#64748b;font-family:monospace;">${profile?.member?.roll_number} | ${profile?.member?.member_id}</p>
          <img src="${qrDataUrl}" style="width:240px;height:240px;border-radius:8px;" />
          <p style="margin:16px 0 0 0;font-size:11px;color:#94a3b8;letter-spacing:0.05em;text-transform:uppercase;">Infin8 Access v1.2</p>
        </div>
      </body></html>`);
      w.document.close();
      w.print();
    }
  };

  const handleAvatarClick = () => {
    if (profile?.member?.photo_url) {
      toast('info', 'Your profile image has already been uploaded. Please contact the administrator if changes are required.');
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast('error', 'Only JPG, PNG and WEBP formats are supported');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('error', 'Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;
      
      canvas.width = 400;
      canvas.height = 400;
      
      ctx.drawImage(img, startX, startY, size, size, 0, 0, 400, 400);
      
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
      if (!blob) throw new Error('Failed to create blob');
      
      const formData = new FormData();
      formData.append('image', blob, 'profile.jpg');
      
      const res = await apiCall(`/api/members/${user?.id}/profile-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorText = await res.text();
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = errorText || res.statusText;
          }
        } catch (e) {}
        throw new Error(errorMessage);
      }
      
      const result = await res.json();
      
      setProfile((prev: any) => ({
        ...prev,
        member: {
          ...prev.member,
          photo_url: result.photo_url
        }
      }));
      
      toast('success', 'Profile image uploaded successfully.');
      
    } catch (err: any) {
      console.error(err);
      toast('error', err.message || 'Failed to process image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const m = profile?.member;
  const collegeName = settings.college_name || 'Malla Reddy Technical Campus';

  const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'clubpass', label: 'Digital Pass', icon: CreditCard },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--ia-bg)] flex flex-col font-sans selection:bg-[var(--ia-accent)]/20 selection:text-[var(--ia-accent)]">
      {/* Fullscreen QR overlay */}
      {showFullscreenQR && qrDataUrl && (
        <div 
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in cursor-pointer"
          onClick={() => setShowFullscreenQR(false)}
        >
          <div 
            className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-scale-in cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-3 rounded-xl inline-block border border-gray-100 shadow-sm mb-4">
              <img src={qrDataUrl} alt="Student QR Code" className="w-64 h-64 mx-auto rounded-lg object-contain" />
            </div>
            <h3 className="text-base font-semibold text-[var(--ia-text)]">{m?.full_name || m?.name}</h3>
            <p className="text-xs font-mono text-[var(--ia-text-muted)] mt-1">{m?.roll_number} &middot; {m?.member_id}</p>
            <div className="mt-5 pt-4 border-t border-[var(--ia-border)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--ia-text-muted)]">Tap outside or press button</span>
              <button
                onClick={() => setShowFullscreenQR(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] text-xs font-medium text-[var(--ia-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ia-accent)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[var(--ia-surface)]/90 backdrop-blur-md border-b border-[var(--ia-border)] sticky top-0 z-50 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--ia-accent)]/10 border border-[var(--ia-accent)]/20 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-[var(--ia-accent)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-[var(--ia-text)] tracking-tight">Infin8 Access</h1>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-muted)]">Student</span>
              </div>
              <p className="text-[11px] text-[var(--ia-text-muted)] hidden sm:block truncate max-w-[200px]">{collegeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center">
              <ISTTime />
            </div>
            <div className="hidden md:block h-4 w-px bg-[var(--ia-border)]" />
            <ThemeToggle />
            
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--ia-elevated)] border border-[var(--ia-border)]">
              <div className="w-6 h-6 rounded-md bg-[var(--ia-accent)]/15 text-[var(--ia-accent)] flex items-center justify-center text-xs font-semibold">
                {(user?.name || 'S').charAt(0)}
              </div>
              <div className="text-left leading-tight">
                <p className="text-xs font-medium text-[var(--ia-text)] truncate max-w-[120px]">{user?.name}</p>
                <p className="text-[10px] text-[var(--ia-text-muted)] truncate max-w-[120px]">{user?.club_name || 'Student'}</p>
              </div>
            </div>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-2.5 py-1.5 rounded-lg bg-[var(--ia-elevated)] hover:bg-red-500/10 text-[var(--ia-text-secondary)] hover:text-red-500 border border-[var(--ia-border)] hover:border-red-500/20 text-xs font-medium transition-all duration-150 flex items-center gap-1.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-5 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[var(--ia-border)] pb-px">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-lg transition-all duration-150 relative -mb-px border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ia-accent)] ${
                    isActive
                      ? 'bg-[var(--ia-surface)] text-[var(--ia-text)] border-[var(--ia-border)] border-b-[var(--ia-surface)] shadow-xs font-semibold'
                      : 'border-transparent text-[var(--ia-text-muted)] hover:text-[var(--ia-text-secondary)] hover:bg-[var(--ia-surface)]/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--ia-accent)]' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          {m && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--ia-text-muted)]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono">{m.roll_number}</span>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl skeleton shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-48 skeleton rounded" />
                  <div className="h-4 w-32 skeleton rounded" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-xl p-3.5 space-y-2">
                  <div className="h-3 w-16 skeleton rounded" />
                  <div className="h-4 w-24 skeleton rounded" />
                </div>
              ))}
            </div>
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-xl p-5 space-y-3">
              <div className="h-4 w-36 skeleton rounded" />
              <div className="h-20 w-full skeleton rounded-lg" />
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {!isLoading && activeTab === 'overview' && m && (
          <div className="space-y-5 animate-fade-in">
            {/* Main Student Profile Identity Card */}
            <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] hover:border-[var(--ia-border-active)] rounded-xl p-5 sm:p-6 shadow-xs transition-all duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                  />
                  <div 
                    className={`relative shrink-0 overflow-hidden rounded-xl ${!m.photo_url ? 'cursor-pointer group' : 'cursor-pointer'}`} 
                    onClick={handleAvatarClick}
                    title={m.photo_url ? "Profile image already uploaded" : "Upload profile image"}
                  >
                    {m.photo_url ? (
                      <img 
                        src={m.photo_url} 
                        alt={m.full_name || m.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-[var(--ia-border)] shadow-xs transition-transform duration-200 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--ia-accent)]/20 to-[var(--ia-accent)]/5 text-[var(--ia-accent)] border border-[var(--ia-accent)]/20 flex items-center justify-center text-xl font-bold shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:border-[var(--ia-accent)]/40">
                        {(m.full_name || m.name)?.charAt(0)}
                      </div>
                    )}
                    
                    {!m.photo_url && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4 text-white mb-0.5" />
                        <span className="text-[8px] text-white font-medium uppercase tracking-wider">Add</span>
                      </div>
                    )}
                    
                    {isUploading && (
                      <div className="absolute inset-0 bg-[var(--ia-surface)]/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[var(--ia-border)]">
                        <div className="w-5 h-5 border-2 border-[var(--ia-accent)]/30 border-t-[var(--ia-accent)] rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-semibold text-[var(--ia-text)] tracking-tight truncate">
                        {m.full_name || m.name}
                      </h2>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        m.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        {m.status || 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--ia-text-muted)] flex-wrap">
                      <span className="font-mono bg-[var(--ia-elevated)] px-2 py-0.5 rounded border border-[var(--ia-border)] text-[var(--ia-text-secondary)] font-medium">
                        {m.roll_number}
                      </span>
                      <span>&middot;</span>
                      <span className="font-mono text-[11px]">{m.member_id}</span>
                      <span>&middot;</span>
                      <span className="text-[var(--ia-accent)] font-medium">{m.club_name}</span>
                    </div>
                  </div>
                </div>

                {qrDataUrl && (
                  <button 
                    onClick={() => setShowFullscreenQR(true)} 
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] border border-[var(--ia-border)] transition-all duration-150 group shrink-0 active:scale-95 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ia-accent)] self-start sm:self-auto"
                    title="Click to view full screen QR"
                  >
                    <div className="bg-white p-1 rounded-lg border border-gray-200">
                      <img src={qrDataUrl} alt="QR Code Preview" className="w-10 h-10 rounded" />
                    </div>
                    <div className="text-left pr-1">
                      <span className="text-xs font-medium text-[var(--ia-text)] block group-hover:text-[var(--ia-accent)] transition-colors">Show QR</span>
                      <span className="text-[10px] text-[var(--ia-text-muted)] block">Tap to expand</span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Academic Information Grid */}
            <div>
              <h3 className="text-xs font-semibold text-[var(--ia-text-muted)] uppercase tracking-wider mb-2.5">Academic Profile</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <InfoCard label="Department" value={m.department} icon={UserCheck} />
                <InfoCard label="Academic Year" value={formatYear(m.year)} icon={Clock} />
                <InfoCard label="Section" value={m.section} icon={FileText} />
                <InfoCard label="Club Name" value={m.club_name} icon={Sparkles} />
                <InfoCard label="Club Role" value={m.club_role || 'Member'} icon={Shield} />
              </div>
            </div>

            {/* Permissions History List */}
            {profile.permissions !== undefined && (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--ia-text)]">Recent Gate Passes</h3>
                    <p className="text-xs text-[var(--ia-text-muted)] mt-0.5">History of requested and granted exit permissions</p>
                  </div>
                  <span className="text-xs font-mono text-[var(--ia-text-muted)] bg-[var(--ia-elevated)] px-2 py-0.5 rounded border border-[var(--ia-border)]">
                    {profile.permissions?.length || 0} Record(s)
                  </span>
                </div>

                {profile.permissions?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[var(--ia-border)] text-[var(--ia-text-muted)] font-medium">
                          <th className="pb-2.5 font-medium">Date & Time</th>
                          <th className="pb-2.5 font-medium">Purpose</th>
                          <th className="pb-2.5 font-medium">Approved By</th>
                          <th className="pb-2.5 font-medium">Return Time</th>
                          <th className="pb-2.5 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--ia-border)]/50 text-[var(--ia-text)]">
                        {profile.permissions.map((p: any) => {
                          const status = p.effective_status || p.status;
                          return (
                            <tr key={p.id} className="hover:bg-[var(--ia-elevated)]/50 transition-colors">
                              <td className="py-2.5 font-medium">
                                <div>{p.date}</div>
                                <div className="text-[10px] text-[var(--ia-text-muted)] font-mono">{p.time}</div>
                              </td>
                              <td className="py-2.5 max-w-[200px] truncate text-[var(--ia-text-secondary)]" title={p.purpose}>
                                {p.purpose || '—'}
                              </td>
                              <td className="py-2.5 text-[var(--ia-text-secondary)]">
                                {p.hod_name ? `${p.hod_name}` : 'HOD'}
                              </td>
                              <td className="py-2.5 font-mono text-[var(--ia-text-secondary)]">
                                {p.expected_return_time || '16:00'}
                              </td>
                              <td className="py-2.5 text-right">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${getStatusBadgeStyle(status)}`}>
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-[var(--ia-border)] rounded-xl bg-[var(--ia-elevated)]/30">
                    <div className="w-10 h-10 rounded-full bg-[var(--ia-elevated)] border border-[var(--ia-border)] flex items-center justify-center mx-auto mb-2.5">
                      <FileText className="w-5 h-5 text-[var(--ia-text-muted)]" />
                    </div>
                    <p className="text-xs font-semibold text-[var(--ia-text)]">No gate pass records found</p>
                    <p className="text-[11px] text-[var(--ia-text-muted)] mt-0.5 max-w-xs mx-auto">Permissions granted by your HOD will appear here automatically</p>
                  </div>
                )}
              </div>
            )}

            {/* Faculty Coordinators Section */}
            {profile.coordinators?.length > 0 && (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs font-semibold text-[var(--ia-text-muted)] uppercase tracking-wider">Faculty Club Coordinators</h3>
                  <span className="text-[11px] text-[var(--ia-text-muted)]">{m.club_name}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.coordinators.map((fc: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--ia-elevated)] border border-[var(--ia-border)] hover:border-[var(--ia-border-active)] hover:-translate-y-0.5 transition-all duration-200 shadow-xs">
                      <div className="w-9 h-9 rounded-xl bg-[var(--ia-accent)]/15 text-[var(--ia-accent)] border border-[var(--ia-accent)]/20 flex items-center justify-center text-xs font-bold shrink-0">
                        {fc.name?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[var(--ia-text)] truncate">{fc.name}</p>
                        <p className="text-[11px] font-mono text-[var(--ia-text-muted)] truncate">{fc.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ClubPass Tab (Digital Card) */}
        {!isLoading && activeTab === 'clubpass' && m && (
          <div className="space-y-5 animate-fade-in">
            {/* Digital ClubPass Card Container */}
            <div 
              ref={clubpassRef} 
              className="bg-white rounded-2xl overflow-hidden shadow-md max-w-sm mx-auto border border-gray-200 text-gray-900 transition-all"
            >
              {/* Card Header */}
              <div className="bg-slate-900 px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">{collegeName}</p>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5">Infin8 Access Pass</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  {m.photo_url ? (
                    <img crossOrigin="anonymous" src={m.photo_url} alt={m.full_name || m.name} className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-xs shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-2xl font-bold shrink-0 shadow-xs">
                      {(m.full_name || m.name)?.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-gray-900 leading-tight truncate">{m.full_name || m.name}</h3>
                    <p className="text-xs font-mono text-gray-600 mt-1">{m.roll_number}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700">
                      {m.member_id}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-left">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Department</p>
                    <p className="text-xs text-gray-900 font-medium mt-0.5 truncate">{m.department}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Year & Sec</p>
                    <p className="text-xs text-gray-900 font-medium mt-0.5 truncate">{formatYear(m.year)} &middot; {m.section}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Club</p>
                    <p className="text-xs text-blue-600 font-bold mt-0.5 truncate">{m.club_name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Role</p>
                    <p className="text-xs text-gray-900 font-medium mt-0.5 truncate">{m.club_role || 'Member'}</p>
                  </div>
                </div>

                {/* QR Code Section */}
                {qrDataUrl && (
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-4">
                    <div className="p-1.5 bg-white border border-gray-200 rounded-xl shadow-2xs shrink-0">
                      <img src={qrDataUrl} alt="Student QR" className="w-20 h-20 rounded-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">Gate Verification</p>
                      <p className="text-xs font-mono text-gray-800 font-medium mt-0.5">{profile.member.member_id}</p>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        profile.member.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {profile.member.status || 'Active'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="max-w-sm mx-auto">
              <div className="grid grid-cols-4 gap-2">
                <ActionButton icon={Maximize2} label="View QR" onClick={() => setShowFullscreenQR(true)} />
                <ActionButton icon={QrCode} label={isExporting ? "Exporting..." : "Save QR"} onClick={downloadQR} disabled={isExporting} />
                <ActionButton icon={Download} label={isExporting ? "Exporting..." : "Save Image"} onClick={downloadPNG} disabled={isExporting} />
                <ActionButton icon={Printer} label="Print" onClick={printQR} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-[var(--ia-border)] py-3 text-center text-[11px] text-[var(--ia-text-muted)] bg-[var(--ia-surface)]">
        Infin8 Access &middot; Malla Reddy Technical Campus &middot; v1.2
      </footer>
    </div>
  );
}

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] hover:border-[var(--ia-border-active)] hover:-translate-y-0.5 rounded-xl p-3.5 transition-all duration-200 shadow-xs hover:shadow-sm">
      <div className="flex items-center justify-between gap-1">
        <p className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wider">{label}</p>
        {Icon && <Icon className="w-3.5 h-3.5 text-[var(--ia-text-muted)] opacity-70" />}
      </div>
      <p className="text-xs sm:text-sm text-[var(--ia-text)] font-semibold mt-1.5 truncate">{value || '—'}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, disabled }: { icon: any; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[var(--ia-surface)] border border-[var(--ia-border)] transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ia-accent)] ${
        disabled 
          ? 'opacity-50 cursor-not-allowed grayscale' 
          : 'hover:bg-[var(--ia-elevated)] hover:border-[var(--ia-border-active)] hover:-translate-y-0.5 text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] active:scale-[0.97] cursor-pointer'
      }`}
    >
      <Icon className={`w-4 h-4 ${disabled ? 'text-gray-400' : 'text-[var(--ia-accent)]'}`} />
      <span className="text-[11px] font-medium leading-none text-center">{label}</span>
    </button>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'granted':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'completed':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'expired':
    case 'closed':
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    case 'rejected':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
}

