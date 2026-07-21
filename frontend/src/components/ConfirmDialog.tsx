import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5 max-w-sm w-full animate-scale-in shadow-xl">
        <button
          onClick={onCancel}
          className="absolute top-3.5 right-3.5 text-[var(--ia-text-muted)] hover:text-[var(--ia-text)] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          {variant === 'danger' && (
            <div className="w-9 h-9 rounded-md bg-red-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 text-[var(--ia-danger)]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-[var(--ia-text)] font-semibold text-sm">{title}</h3>
            <p className="text-[var(--ia-text-secondary)] text-sm mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-md bg-[var(--ia-elevated)] hover:bg-[var(--ia-border)] text-[var(--ia-text-secondary)] text-sm font-medium transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              variant === 'danger'
                ? 'bg-[var(--ia-danger)] hover:bg-red-600 text-white'
                : 'bg-[var(--ia-accent)] hover:bg-[var(--ia-accent-hover)] text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
