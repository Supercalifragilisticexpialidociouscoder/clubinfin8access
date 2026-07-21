import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from './Toast';

interface AttendanceReportFormProps {
  userRole: 'super_admin' | 'institution_admin' | 'hod' | 'coordinator';
}

export default function AttendanceReportForm({ userRole }: AttendanceReportFormProps) {
  const { apiCall } = useAuth();
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'range'>('daily');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [club, setClub] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    
    try {
      const params = new URLSearchParams({ format: 'csv' });
      if (reportType === 'daily' && date) params.append('date', date);
      if (reportType === 'monthly' && month) params.append('month', month);
      if (reportType === 'range') {
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
      }
      if (club) params.append('club', club);
      if (department) params.append('department', department);
      if (status) params.append('status', status);

      const res = await apiCall(`/api/export/permissions?${params.toString()}`);
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = reportType === 'daily' ? `Attendance_Daily_${date || 'All'}.csv` : reportType === 'monthly' ? `Attendance_Monthly_${month || 'All'}.csv` : 'Attendance_Range.csv';
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        toast('success', 'Attendance report downloaded successfully');
      } else {
        toast('error', 'Failed to generate report');
      }
    } catch (err) {
      toast('error', 'Error downloading report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-[var(--ia-surface)] border border-[var(--ia-border)] rounded-lg p-5">
      <h3 className="font-semibold text-sm text-[var(--ia-text)] mb-1 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[var(--ia-accent)]" />
        Attendance & Permission Reports
      </h3>
      <p className="text-[var(--ia-text-muted)] text-xs mb-5">Generate and download official permission attendance sheets.</p>
      
      <form onSubmit={handleExport} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
            >
              <option value="daily">Daily Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="range">Custom Date Range</option>
            </select>
          </div>

          {reportType === 'daily' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
              />
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
              />
            </div>
          )}

          {reportType === 'range' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
                />
              </div>
            </>
          )}

          {userRole !== 'coordinator' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Filter by Club</label>
              <input
                type="text"
                placeholder="Any Club"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
              />
            </div>
          )}

          {userRole !== 'hod' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Filter by Department</label>
              <input
                type="text"
                placeholder="Any Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
              />
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--ia-text-secondary)] uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-[var(--ia-bg)] border border-[var(--ia-border)] rounded-md text-[var(--ia-text)] outline-none focus:border-[var(--ia-accent)] transition-colors"
            >
              <option value="all">All Granted Permissions</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
              <option value="expired">Expired Only</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--ia-accent)] text-white text-xs font-semibold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Generating...' : 'Download Report (CSV)'}
          </button>
        </div>
      </form>
    </div>
  );
}
