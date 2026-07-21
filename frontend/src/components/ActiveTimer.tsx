import { useEffect, useState } from 'react';

// Helper to convert an IST date ('YYYY-MM-DD') and time ('HH:MM') into a UTC timestamp (ms)
function parseISTToUTC(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return 0;
  try {
    const isoStr = `${dateStr}T${timeStr}:00.000+05:30`;
    return new Date(isoStr).getTime();
  } catch {
    return 0;
  }
}

export function PermissionTimer({ permission, large = false }: { permission: any; large?: boolean }) {
  const [elapsed, setElapsed] = useState('');
  const [remaining, setRemaining] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  
  if (!permission || permission.status === 'rejected' || permission.effective_status === 'rejected') {
    return null;
  }

  const effectiveStatus = permission.effective_status || permission.status;

  const calculateDuration = (startMs: number, endMs: number) => {
    const diffMs = Math.max(0, endMs - startMs);
    const diffSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(diffSecs / 3600);
    const minutes = Math.floor((diffSecs % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  useEffect(() => {
    let timer: any;
    
    const updateTimes = () => {
      const startMs = permission.approved_at 
        ? new Date(permission.approved_at).getTime() 
        : parseISTToUTC(permission.date, permission.time);
      
      if (!startMs || isNaN(startMs)) {
        setElapsed('N/A');
        return;
      }

      if (effectiveStatus === 'closed') {
        const endMs = permission.closed_at ? new Date(permission.closed_at).getTime() : Date.now();
        setElapsed(calculateDuration(startMs, endMs));
      } else if (effectiveStatus === 'expired') {
        const expiryTime = permission.expected_return_time || '16:00';
        let endMs = parseISTToUTC(permission.date, expiryTime);
        if (!endMs || endMs < startMs) endMs = startMs;
        setElapsed(calculateDuration(startMs, endMs));
      } else if (effectiveStatus === 'active') {
        const nowMs = Date.now();
        setElapsed(calculateDuration(startMs, nowMs));
        
        if (permission.expected_return_time) {
          const endMs = parseISTToUTC(permission.date, permission.expected_return_time);
          if (endMs) {
            if (nowMs > endMs) {
              setIsOverdue(true);
              setRemaining(calculateDuration(endMs, nowMs) + ' overdue');
            } else {
              setIsOverdue(false);
              setRemaining(calculateDuration(nowMs, endMs));
            }
          }
        }
      }
    };

    updateTimes();

    if (effectiveStatus === 'active') {
      timer = setInterval(updateTimes, 60000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [permission, effectiveStatus]);

  if (effectiveStatus === 'active') {
    if (large) {
      return (
        <div className="flex gap-6 mt-2">
          <div>
            <div className="text-[11px] text-[var(--ia-text-muted)] uppercase font-semibold tracking-wider mb-1">Elapsed</div>
            <div className="text-xl font-bold text-amber-500 font-mono tracking-tight">{elapsed}</div>
          </div>
          {permission.expected_return_time && (
            <div>
              <div className="text-[11px] text-[var(--ia-text-muted)] uppercase font-semibold tracking-wider mb-1">Remaining</div>
              <div className={`text-xl font-bold font-mono tracking-tight ${isOverdue ? 'text-[var(--ia-danger)]' : 'text-[var(--ia-success)]'}`}>
                {remaining}
              </div>
            </div>
          )}
        </div>
      );
    }
    return <span className="text-amber-500 font-bold">{elapsed}</span>;
  }
  
  if (large) {
    return (
      <div className="mt-2">
        <div className="text-[11px] text-[var(--ia-text-muted)] uppercase font-semibold tracking-wider mb-1">Actual Duration</div>
        <div className="text-xl font-bold text-[var(--ia-text-secondary)] font-mono tracking-tight">{elapsed}</div>
      </div>
    );
  }

  return <span className="text-[var(--ia-text-secondary)] font-medium">{elapsed}</span>;
}

export function formatISTTime(utcString: string) {
  if (!utcString) return '';
  const d = new Date(utcString);
  return d.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }) + ' IST';
}
