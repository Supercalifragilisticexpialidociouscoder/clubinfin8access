import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Search by name, roll number, member ID...',
  value,
  onChange,
  debounceMs = 300,
  className = '',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (val: string) => {
    setLocalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, debounceMs);
  };

  const clear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ia-text-muted)]" />
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full pl-9 pr-8 py-2 rounded-md bg-[var(--ia-input)] border border-[var(--ia-border)] text-[var(--ia-text)] placeholder-[var(--ia-text-muted)] text-sm focus:outline-none focus:border-[var(--ia-accent)] transition-colors"
      />
      {localValue && (
        <button
          onClick={clear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ia-text-muted)] hover:text-[var(--ia-text)] transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
