import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function ISTTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const timeStr = time.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="flex items-center gap-2 text-[var(--ia-text-secondary)]">
      <Clock className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{dateStr}</span>
      <span className="text-xs text-[var(--ia-text-muted)]">·</span>
      <span className="text-xs font-medium">{timeStr} IST</span>
    </div>
  );
}
