import React, { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from './Toast';

interface NotificationComposerProps {
  userRole: 'super_admin' | 'institution_admin' | 'hod' | 'coordinator';
  clubId?: string;
  department?: string;
  onSuccess?: () => void;
}

export default function NotificationComposer({ userRole, clubId, department, onSuccess }: NotificationComposerProps) {
  const { apiCall } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);

  const getAudienceOptions = () => {
    if (userRole === 'super_admin' || userRole === 'institution_admin') {
      return [
        { value: 'all', label: 'All Users (Institution-wide)' },
        { value: 'all_students', label: 'All Students' },
        { value: 'all_hods', label: 'All HODs' },
        { value: 'all_coordinators', label: 'All Coordinators' }
      ];
    } else if (userRole === 'hod') {
      return [
        { value: 'department', label: `Department: ${department || 'Your Department'}` }
      ];
    } else if (userRole === 'coordinator') {
      return [
        { value: 'club', label: `Club Members` }
      ];
    }
    return [];
  };

  const options = getAudienceOptions();

  // Auto-select if only one option exists
  React.useEffect(() => {
    if (options.length === 1 && !targetAudience) {
      setTargetAudience(options[0].value);
    }
  }, [options, targetAudience]);

  const handleSend = async () => {
    if (!title || !message || !targetAudience) {
      toast('error', 'Please fill in all fields');
      return;
    }

    setIsSending(true);
    try {
      const res = await apiCall('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          target_audience: targetAudience,
          club_id: clubId,
          department: department
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast('success', `Announcement sent to ${data.count} recipients`);
        setTitle('');
        setMessage('');
        setConfirmMode(false);
        if (onSuccess) onSuccess();
      } else {
        toast('error', data.error || 'Failed to send announcement');
      }
    } catch (err) {
      toast('error', 'Network error');
    } finally {
      setIsSending(false);
    }
  };

  if (confirmMode) {
    return (
      <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
        <div className="flex items-center gap-2 text-[var(--ia-warning)] mb-3">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold text-sm">Confirm Broadcast</h3>
        </div>
        <p className="text-xs text-[var(--ia-text-secondary)] mb-4">
          You are about to send an announcement to <strong>{options.find(o => o.value === targetAudience)?.label}</strong>. This action cannot be undone.
        </p>
        <div className="bg-[var(--ia-bg)] p-3 rounded border border-[var(--ia-border)] mb-5 space-y-1">
          <p className="font-semibold text-sm text-[var(--ia-text)]">{title}</p>
          <p className="text-xs text-[var(--ia-text-muted)]">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmMode(false)}
            disabled={isSending}
            className="px-4 py-2 text-xs font-medium text-[var(--ia-text-secondary)] hover:text-[var(--ia-text)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--ia-accent)] text-white text-xs font-semibold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Confirm & Send'}
            {!isSending && <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
      <h3 className="font-semibold text-sm text-[var(--ia-text)] mb-4">Compose Announcement</h3>
      
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Target Audience</label>
          <select
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
          >
            <option value="" disabled>Select audience...</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement Title"
            className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
            className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors resize-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setConfirmMode(true)}
            disabled={!title || !message || !targetAudience}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--ia-accent)] text-white text-xs font-semibold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            Review Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}
