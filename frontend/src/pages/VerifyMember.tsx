import { useEffect, useState } from 'react';
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
}

interface VerifyResponse {
  member: MemberData;
  coordinators: Coordinator[];
  today_permission: PermissionData | null;
}

export default function VerifyMember() {
  const { uuid } = useParams<{ uuid: string }>();
  const { user, apiCall } = useAuth();

  const [data, setData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [purpose, setPurpose] = useState('');
  const [remark, setRemark] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/verify/${uuid}`, {
          headers: user ? { 'Authorization': `Bearer ${localStorage.getItem('clubpass_token')}` } : {},
        });
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || 'Member not found');
          // If suspended, we still get the member data object
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
        // Update local state
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

  if (loading) {
    return (
      <div className="dark min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verifying member...</p>
        </div>
      </div>
    );
  }

  if (error && !data?.member) {
    return (
      <div className="dark min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Verification Failed</h1>
          <p className="text-slate-400 text-sm">{error || 'Member not found'}</p>
          <p className="text-slate-500 text-xs mt-4">QR Code may be invalid or expired.</p>
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
    <div className="dark min-h-screen gradient-primary p-4 md:p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-500/8 blur-3xl" />
      </div>

      <div className="mx-auto max-w-lg space-y-5 relative">
        {/* ===== VERIFICATION STATUS HEADER ===== */}
        <div className={`rounded-2xl p-6 text-center animate-bounce-in ${
          isActive
            ? 'bg-gradient-to-r from-emerald-500/15 to-green-500/10 border border-emerald-500/20'
            : 'bg-gradient-to-r from-red-500/15 to-red-500/10 border border-red-500/20'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${
            isActive ? 'bg-gradient-to-br from-emerald-500 to-green-400 shadow-emerald-500/25' : 'bg-gradient-to-br from-red-500 to-rose-400 shadow-red-500/25'
          }`}>
            {isActive ? (
              <ShieldCheck className="w-8 h-8 text-white" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className={`text-xl font-bold tracking-tight uppercase ${isActive ? 'text-emerald-300' : 'text-red-300'}`}>
            {isActive ? 'Verified Active Member' : `Member ${member.status}`}
          </h1>
          <p className="text-slate-500 text-xs mt-1">Scanned at {new Date().toLocaleString()}</p>
        </div>

        {/* ===== ANTI-QR-SHARING: IDENTITY CARD ===== */}
        <div className="glass-card rounded-2xl overflow-hidden animate-slide-up animation-delay-100">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/10 p-6 border-b border-white/5">
            <div className="flex items-center gap-5">
              {member.photo_url ? (
                <img src={member.photo_url} alt={member.name} className="w-24 h-24 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-2 ring-blue-500/30">
                  {member.name?.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white truncate">{member.name}</h2>
                <p className="text-blue-300 font-mono text-lg mt-0.5">{member.roll_number}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isActive ? 'status-active' : 'status-inactive'}`}>
                    {member.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Hash className="w-3 h-3" /> {member.member_id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            <InfoRow icon={Building2} label="Department" value={member.department} />
            <InfoRow icon={Calendar} label="Year / Section" value={`Year ${member.year || 1} — ${member.section || 'N/A'}`} />
            <InfoRow icon={Shield} label="Club" value={member.club || 'N/A'} highlight />
            <InfoRow icon={User} label="Position" value={member.position || 'Member'} />
            <InfoRow icon={Mail} label="Email" value={member.email || 'N/A'} full />
          </div>

          {coordinators.length > 0 && (
            <div className="px-6 pb-6 border-t border-white/5 pt-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Assigned Faculty Coordinators</p>
              <div className="space-y-2">
                {coordinators.map((fc, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center text-xs font-bold">
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

        {/* ===== PERMISSION STATUS ===== */}
        {isActive && (
          <div className="animate-slide-up animation-delay-200">
            {today_permission ? (
              <div className={`glass-card rounded-2xl p-6 ${today_permission.status === 'granted' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${today_permission.status === 'granted' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {today_permission.status === 'granted' ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${today_permission.status === 'granted' ? 'text-emerald-300' : 'text-red-300'}`}>
                      {today_permission.status === 'granted' ? 'Permission Granted' : 'Permission Rejected'}
                    </h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Processed today at {today_permission.time}
                    </p>
                  </div>
                  {today_permission.overdue_minutes && (
                    <div className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> OVERDUE {today_permission.overdue_minutes}m
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <DetailRow icon={UserCheck} label="Approved By" value={today_permission.approved_by} />
                  {today_permission.purpose && <DetailRow icon={FileText} label="Purpose" value={today_permission.purpose} />}
                  {today_permission.remark && <DetailRow icon={MessageSquare} label="Remark" value={today_permission.remark} />}
                  {today_permission.expected_return_time && <DetailRow icon={Clock} label="Expected Return" value={today_permission.expected_return_time} />}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-300">No Permission Today</h3>
                    <p className="text-slate-500 text-xs">No permission request has been processed today.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== HOD ACTION FORM ===== */}
        {isActive && !today_permission && isHOD && (
          <div className="glass-card rounded-2xl p-6 animate-slide-up animation-delay-300">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Process Permission Request
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Purpose *</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input placeholder="e.g. Club Meeting, Event Preparation" value={purpose} onChange={(e) => setPurpose(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Remark (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input placeholder="Additional notes..." value={remark} onChange={(e) => setRemark(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block flex items-center justify-between">
                  Expected Return Time (Optional)
                  <span className="text-xs text-slate-500 font-normal">For tracking overdue</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="time" value={expectedReturnTime} onChange={(e) => setExpectedReturnTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => handlePermission('granted')} disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold hover:from-emerald-500 hover:to-green-400 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Grant
                </button>
                <button onClick={() => handlePermission('rejected')} disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold hover:from-red-500 hover:to-rose-400 disabled:opacity-50 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" /> Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Coordinator notice */}
        {isActive && !today_permission && isCoordinator && (
          <div className="glass-card rounded-2xl p-5 border-yellow-500/20 animate-slide-up animation-delay-300">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-yellow-500 shrink-0" />
              <div>
                <p className="text-yellow-300 font-medium text-sm">Coordinator — View Only</p>
                <p className="text-slate-500 text-xs">You can view member details but cannot process permission requests.</p>
              </div>
            </div>
          </div>
        )}

        {/* Not logged in prompt */}
        {isActive && !today_permission && !user && (
          <div className="glass-card rounded-2xl p-5 border-slate-500/20 animate-slide-up animation-delay-300 text-center">
            <p className="text-slate-400 text-sm mb-3">Administrator login required to process permissions.</p>
            <a href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors text-sm font-medium">
              <LogIn className="w-4 h-4" /> Sign In
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 pb-4">
          ClubPass v1.2
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, highlight, full }: { icon: any; label: string; value: string; highlight?: boolean; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
        <Icon className="w-3.5 h-3.5" />
        <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className={`text-sm ml-5 ${highlight ? 'text-blue-300 font-semibold' : 'text-slate-200'}`}>
        {value || '—'}
      </p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
      <div>
        <span className="text-slate-500 text-xs uppercase">{label}</span>
        <p className="text-slate-200 font-medium">{value}</p>
      </div>
    </div>
  );
}
