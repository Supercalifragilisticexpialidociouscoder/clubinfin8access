import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface ClosePermissionModalProps {
  permission: any;
  onConfirm: (reason: string, customRemark?: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ClosePermissionModal({ permission, onConfirm, onCancel, isSubmitting }: ClosePermissionModalProps) {
  const [reason, setReason] = useState('Student Returned');
  const [customRemark, setCustomRemark] = useState('');

  const REASONS = [
    'Student Returned',
    'Activity Finished',
    'Permission Ended Early',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[var(--ia-elevated)] border border-[var(--ia-border)] rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--ia-text)]">Close Permission</h2>
              <p className="text-sm text-[var(--ia-text-muted)] mt-1">End the active permission for this student</p>
            </div>
            <button 
              onClick={onCancel}
              className="p-2 -mr-2 text-[var(--ia-text-muted)] hover:text-[var(--ia-text)] rounded-lg hover:bg-[var(--ia-bg)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-3 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-lg">
              <p className="text-sm font-medium text-[var(--ia-text)]">{permission.member_name || permission.full_name}</p>
              <p className="text-xs text-[var(--ia-text-muted)] mt-0.5">{permission.roll_number}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ia-text-secondary)] mb-2">Close Reason</label>
              <div className="space-y-2">
                {REASONS.map(r => (
                  <label key={r} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${reason === r ? 'bg-primary/10 border-primary/30' : 'border-[var(--ia-border)] hover:bg-[var(--ia-bg)]'}`}>
                    <input
                      type="radio"
                      name="close_reason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${reason === r ? 'border-primary' : 'border-[var(--ia-border)]'}`}>
                      {reason === r && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className={`text-sm ${reason === r ? 'text-primary font-medium' : 'text-[var(--ia-text)]'}`}>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-[var(--ia-text-secondary)] mb-2">Custom Remark (Optional)</label>
                <input
                  type="text"
                  value={customRemark}
                  onChange={(e) => setCustomRemark(e.target.value)}
                  className="w-full bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-lg px-3 py-2 text-[var(--ia-text)] text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Enter details..."
                  maxLength={100}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--ia-border)]">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-lg border border-[var(--ia-border)] text-[var(--ia-text)] hover:bg-[var(--ia-bg)] text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reason, customRemark)}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground hover:brightness-110 text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(var(--ia-primary-rgb),0.3)]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <>
                  <Check size={16} />
                  <span>Confirm Close</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
