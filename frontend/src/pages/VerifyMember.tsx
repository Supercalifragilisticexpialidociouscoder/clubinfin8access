import { useEffect, useState } from 'react';
import ISTTime from '../components/ISTTime';
import { PermissionTimer, formatISTTime } from '../components/ActiveTimer';
import { ClosePermissionModal } from '../components/ClosePermissionModal';
import { ThemeToggle } from '../components/ThemeToggle';
import { useParams } from 'react-router-dom';
import { useAuth, API_BASE } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import {
  ShieldCheck, AlertTriangle, User, Calendar, Clock, Building2,
  MapPin, Hash, Shield, Mail, CheckCircle2, XCircle, Info, FileText,
  MessageSquare, UserCheck, Eye, LogIn
} from 'lucide-react';

interface MemberData {
  uuid: string;
  member_id: string;
  name: string;
  roll_number: string;
  email: string;
  department: string;
  year: number;
  section: string;
  club: string;
  club_id: number;
  position: string;
  status: string;
  photo_url: string | null;
  member_type: string;
}

interface Coordinator {
  name: string;
  email: string;
}

interface PermissionData {
  id: string;
  date: string;
  time: string;
  status: string;
  purpose: string;
  remark: string;
  expected_return_time: string | null;
  approved_by: string;
  approved_at: string;
  created_at: string;
  overdue_minutes?: number | null;
  effective_status?: string;
}

interface VerifyResponse {
  member: MemberData;
  coordinators: Coordinator[];
  today_permission: PermissionData | null;
}


const getCurrentISTTimeStr = () => {
  return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
};

const checkExpired = (p: any, currentIST: string) => {
  if (p.status !== 'granted') return false;
  if (currentIST >= '16:00') return true;
  if (p.expected_return_time && currentIST >= p.expected_return_time) return true;
  return false;
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
    { label: '1 Minute (Test)', time: addTime(1) },
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

export default function VerifyMember() {
  const { uuid } = useParams<{ uuid: string; }>();
  const { user, apiCall } = useAuth();

  const [data, setData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [purpose, setPurpose] = useState('');
  const [remark, setRemark] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentIST, setCurrentIST] = useState(getCurrentISTTimeStr());
  const [closeModal, setCloseModal] = useState<{ open: boolean; permission: any }>({ open: false, permission: null });

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/verify/${uuid}`, {
        headers: user ? { 'Authorization': `Bearer ${localStorage.getItem('clubpass_token')}` } : {},
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Member not found');
        if (errData.member) {
          setData({ member: errData.member, coordinators: [], today_permission: null });
        }
        setLoading(false);
        return;
      }
      const responseData = await res.json();
      setData(responseData);
    } catch {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const closePermission = async (reason: string, customRemark?: string) => {
    if (!closeModal.permission) return;
    setLoading(true);
    try {
      const res = await apiCall(`/api/permissions/${closeModal.permission.id}/close`, { 
        method: 'POST',
        body: JSON.stringify({ close_reason: reason === 'Other' ? `Other: ${customRemark}` : reason })
      });
      if (res.ok) {
        toast('success', 'Permission closed');
        setCloseModal({ open: false, permission: null });
        fetchData();
      } else {
        toast('error', 'Failed to close permission');
      }
    } catch {
      toast('error', 'Network error');
    }
    setLoading(false);
  };

  const [durationMode, setDurationMode] = useState<'quick' | 'custom'>('quick');

  useEffect(() => {
    const timer = setInterval(() => setCurrentIST(getCurrentISTTimeStr()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, [uuid, user]);

  const handlePermission = async (status: 'granted' | 'rejected') => {
    if (!purpose.trim()) {
      toast('error', 'Purpose is required');
      return;
    }
    setSubmitting(true);

    try {
      const res = await apiCall('/api/permissions', {
        method: 'POST',
        body: JSON.stringify({
          member_uuid: uuid,
          purpose: purpose.trim(),
          remark: remark.trim() || null,
          expected_return_time: expectedReturnTime || null,
          status,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast('error', result.error || 'Failed to process permission');
      } else {
        toast('success', `Permission ${status === 'granted' ? 'granted' : 'rejected'} successfully`);
        setData(prev => prev ? {
          ...prev,
          today_permission: {
            id: result.permission.id,
            date: result.permission.date,
            time: result.permission.time,
            status: result.permission.status,
            purpose: result.permission.purpose,
            remark: result.permission.remark || '',
            expected_return_time: result.permission.expected_return_time,
            approved_by: result.permission.approved_by,
            approved_at: result.permission.approved_at,
            created_at: new Date().toISOString(),
          },
        } : null);
      }
    } catch {
      toast('error', 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[var(--ia-bg)] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-[var(--ia-accent)]/30 border-t-[var(--ia-accent)] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[var(--ia-text-muted)] text-sm">Verifying member...</p>
        </div>
      </div>
    );
  }

  if (error && !data?.member) {
    return (
      <div className="min-h-screen bg-[var(--ia-bg)] flex items-center justify-center p-4">
        <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-6 max-w-sm w-full text-center animate-scale-in">
          <div className="w-12 h-12 rounded-full bg-[var(--ia-danger)]/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-6 h-6 text-[var(--ia-danger)]" />
          </div>
          <h1 className="text-base font-semibold text-[var(--ia-text)] mb-1">Verification Failed</h1>
          <p className="text-[var(--ia-text-secondary)] text-sm">{error || 'Member not found'}</p>
          <p className="text-[var(--ia-text-muted)] text-xs mt-3">QR Code may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const member = data!.member;
  const coordinators = data?.coordinators || [];
  const today_permission = data?.today_permission || null;
  const isActive = member.status === 'active';
  const isHOD = user?.role === 'hod' || user?.role === 'super_admin';
  const isCoordinator = user?.role === 'coordinator';

  return (
    <div className="min-h-screen bg-[var(--ia-bg)] p-4 md:p-8 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-lg space-y-4 pt-12 md:pt-0">
        {/* ===== VERIFICATION STATUS HEADER ===== */}
        <div className={`rounded-lg p-5 text-center border ${
          isActive
            ? 'bg-[var(--ia-success)]/10 border-[var(--ia-success)]/20'
            : 'bg-[var(--ia-danger)]/10 border-[var(--ia-danger)]/20'
        }`}>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
            isActive ? 'bg-[var(--ia-success)]/20' : 'bg-[var(--ia-danger)]/20'
          }`}>
            {isActive ? (
              <ShieldCheck className={`w-6 h-6 ${isActive ? 'text-[var(--ia-success)]' : 'text-[var(--ia-danger)]'}`} />
            ) : (
              <AlertTriangle className="w-6 h-6 text-[var(--ia-danger)]" />
            )}
          </div>
          <h1 className={`text-lg font-semibold tracking-tight uppercase ${isActive ? 'text-[var(--ia-success)]' : 'text-[var(--ia-danger)]'}`}>
            {isActive ? 'Verified Active Member' : `Member ${member.status}`}
          </h1>
          <p className="text-[var(--ia-text-muted)] text-[11px] mt-1">Scanned at {formatDateTime(new Date().toISOString())}</p>
        </div>

        {/* ===== ANTI-QR-SHARING: IDENTITY CARD ===== */}
        <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg overflow-hidden animate-slide-up">
          <div className="bg-[var(--ia-elevated)] p-5 border-b border-[var(--ia-border)]">
            <div className="flex items-center gap-4">
              {member.photo_url ? (
                <img src={member.photo_url} alt={member.name} className="w-20 h-20 rounded-lg object-cover border border-[var(--ia-border)]" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-[var(--ia-accent)]/15 flex items-center justify-center text-2xl font-semibold text-[var(--ia-accent)] border border-[var(--ia-accent)]/20">
                  {member.name?.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-[var(--ia-text)] truncate">{member.name}</h2>
                <p className="text-[var(--ia-text-secondary)] font-mono text-sm mt-0.5">{member.roll_number}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${isActive ? 'status-active' : 'status-inactive'}`}>
                    {member.status}
                  </span>
                  <span className="text-[11px] text-[var(--ia-text-muted)] flex items-center gap-1"><Hash className="w-3 h-3" /> {member.member_id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-2 gap-3">
            <InfoRow icon={Building2} label="Department" value={member.department} />
            <InfoRow icon={Calendar} label="Year" value={String(member.year || 2)} />
            <InfoRow icon={Calendar} label="Section" value={member.section || 'N/A'} />
            <InfoRow icon={Shield} label="Club" value={member.club || 'N/A'} highlight />
            <InfoRow icon={User} label="Position" value={member.position || 'Member'} />
            <InfoRow icon={Mail} label="Email" value={member.email || 'N/A'} full />
          </div>

          {coordinators.length > 0 && (
            <div className="px-5 pb-5 border-t border-[var(--ia-border)] pt-4">
              <p className="text-[10px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wider mb-2">Assigned Faculty Coordinators</p>
              <div className="space-y-2">
                {coordinators.map((fc, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="w-6 h-6 rounded bg-[var(--ia-info)]/15 text-[var(--ia-info)] flex items-center justify-center text-[10px] font-semibold">
                      {fc.name?.charAt(0)}
                    </span>
                    <div>
                      <span className="text-[var(--ia-text)] text-[13px]">{fc.name}</span>
                      <span className="text-[var(--ia-text-muted)] text-[11px] ml-1.5">{fc.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== PERMISSION STATUS ===== */}
        {isActive && today_permission && (
          <div className="animate-slide-up space-y-4">
            {today_permission.effective_status === 'active' && (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-success)]/25 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--ia-border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--ia-success)]/15">
                      <CheckCircle2 className="w-5 h-5 text-[var(--ia-success)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--ia-success)]">
                        Active Permission
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[var(--ia-text-muted)] font-mono">
                        <Clock className="w-3 h-3" /> Granted at {today_permission.time}
                      </div>
                    </div>
                  </div>
                  {isHOD && (
                    <button onClick={() => setCloseModal({ open: true, permission: today_permission })} className="px-3 py-1.5 rounded bg-[var(--ia-danger)]/10 text-[var(--ia-danger)] hover:bg-[var(--ia-danger)] hover:text-white transition-colors text-xs font-semibold">
                      Close Permission
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <DetailRow icon={UserCheck} label="Approved By" value={today_permission.approved_by} />
                  {today_permission.purpose && <DetailRow icon={FileText} label="Purpose" value={today_permission.purpose} />}
                  {today_permission.remark && <DetailRow icon={MessageSquare} label="Remark" value={today_permission.remark} />}
                  {today_permission.expected_return_time && <DetailRow icon={Clock} label="Expected Return" value={today_permission.expected_return_time} />}
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--ia-border)]">
                  <PermissionTimer permission={today_permission} large />
                </div>
              </div>
            )}

            {today_permission.effective_status === 'expired' && (
              <div className="bg-[var(--ia-surface)] border border-[var(--ia-completed)]/25 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--ia-border)]">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--ia-completed)]/15">
                    <Clock className="w-5 h-5 text-[var(--ia-completed)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--ia-completed)]">
                      Expired Permission
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[var(--ia-text-muted)] font-mono">
                      Ended at {today_permission.expected_return_time || '16:00'}
                    </div>
                  </div>
                </div>
                <div className="space-y-3 opacity-75">
                  <DetailRow icon={UserCheck} label="Approved By" value={today_permission.approved_by} />
                  {today_permission.purpose && <DetailRow icon={FileText} label="Purpose" value={today_permission.purpose} />}
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--ia-border)] opacity-75">
                  <PermissionTimer permission={today_permission} large />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== HOD ACTION FORM ===== */}
        {isActive && (!today_permission || today_permission.effective_status !== 'active') && isHOD && (
          currentIST >= '16:00' ? (
            <div className="bg-[var(--ia-danger)]/5 border border-[var(--ia-danger)]/20 rounded-lg p-5 animate-slide-up text-center">
              <div className="w-10 h-10 rounded-md bg-[var(--ia-danger)]/15 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-[var(--ia-danger)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--ia-danger)] mb-1">Permission Hours Ended</h3>
              <p className="text-xs text-[var(--ia-text-secondary)]">New permissions can be granted on the next working day.</p>
            </div>
          ) : (
          <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5 animate-slide-up">
            <h3 className="text-sm font-semibold text-[var(--ia-text)] mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--ia-accent)]" />
              Process Request
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Purpose *</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ia-text-muted)]" />
                  <input placeholder="e.g. Club Meeting, Event Preparation" value={purpose} onChange={(e) => setPurpose(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide mb-1 block">Remark (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ia-text-muted)]" />
                  <input placeholder="Additional notes..." value={remark} onChange={(e) => setRemark(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-[var(--ia-text-muted)] uppercase tracking-wide block">Expected Return *</label>
                  <div className="flex gap-1">
                    <button onClick={() => setDurationMode('quick')} className={`text-[11px] px-2 py-0.5 rounded transition-colors ${durationMode === 'quick' ? 'bg-[var(--ia-accent)]/15 text-[var(--ia-accent)]' : 'text-[var(--ia-text-muted)] hover:bg-[var(--ia-elevated)]'}`}>Quick</button>
                    <button onClick={() => setDurationMode('custom')} className={`text-[11px] px-2 py-0.5 rounded transition-colors ${durationMode === 'custom' ? 'bg-[var(--ia-accent)]/15 text-[var(--ia-accent)]' : 'text-[var(--ia-text-muted)] hover:bg-[var(--ia-elevated)]'}`}>Custom</button>
                  </div>
                </div>
                
                {durationMode === 'quick' ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {calculateQuickOptions(currentIST).map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => setExpectedReturnTime(opt.time)}
                        disabled={opt.disabled}
                        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors text-left ${expectedReturnTime === opt.time ? 'bg-[var(--ia-accent)] text-white' : 'bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text-secondary)] hover:bg-[var(--ia-border)] disabled:opacity-25 disabled:cursor-not-allowed'}`}
                      >
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                          <span className={`text-[10px] ${expectedReturnTime === opt.time ? 'text-blue-200' : 'text-[var(--ia-text-muted)]'}`}>{opt.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative mt-1.5">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ia-text-muted)]" />
                    <input type="time" max="16:00" min={currentIST} value={expectedReturnTime} onChange={(e) => setExpectedReturnTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <button onClick={() => handlePermission('granted')} disabled={submitting || !expectedReturnTime || expectedReturnTime > '16:00' || expectedReturnTime <= currentIST}
                  className="flex-1 py-2 rounded-md bg-[var(--ia-success)] hover:bg-green-600 text-white text-sm font-semibold disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Grant
                </button>
                <button onClick={() => handlePermission('rejected')} disabled={submitting}
                  className="flex-1 py-2 rounded-md bg-[var(--ia-danger)] hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          </div>
          )
        )}

        {/* Coordinator notice */}
        {isActive && (!today_permission || checkExpired(today_permission, currentIST) || today_permission.status !== 'granted') && isCoordinator && (
          <div className="bg-[var(--ia-surface)] border border-[var(--ia-warning)]/30 rounded-lg p-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-[var(--ia-warning)] shrink-0" />
              <div>
                <p className="text-[var(--ia-text)] font-medium text-sm">Coordinator — View Only</p>
                <p className="text-[var(--ia-text-secondary)] text-xs mt-0.5">You can view member details but cannot process permission requests.</p>
              </div>
            </div>
          </div>
        )}

        {/* Not logged in prompt */}
        {isActive && (!today_permission || checkExpired(today_permission, currentIST) || today_permission.status !== 'granted') && !user && (
          <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-4 animate-slide-up text-center">
            <p className="text-[var(--ia-text-secondary)] text-sm mb-3">Administrator login required to process permissions.</p>
            <a href="/login" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--ia-elevated)] border border-[var(--ia-border)] text-[var(--ia-text)] hover:bg-[var(--ia-border)] transition-colors text-sm font-medium">
              <LogIn className="w-4 h-4" /> Sign In
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[11px] text-[var(--ia-text-muted)] pb-4">
          Infin8 Access v1.2
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, highlight, full }: { icon: any; label: string; value: string; highlight?: boolean; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <div className="flex items-center gap-1 text-[var(--ia-text-muted)] mb-0.5">
        <Icon className="w-3 h-3" />
        <p className="text-[10px] font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className={`text-[13px] ml-4 ${highlight ? 'text-[var(--ia-accent)] font-medium' : 'text-[var(--ia-text)]'}`}>
        {value || '—'}
      </p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-[var(--ia-text-muted)] mt-0.5 shrink-0" />
      <div>
        <span className="text-[var(--ia-text-muted)] text-[10px] uppercase tracking-wider">{label}</span>
        <p className="text-[var(--ia-text)] text-[13px]">{value}</p>
      </div>
    </div>
  );
}

