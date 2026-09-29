import React, { useEffect, useState } from 'react';
import { AuditLog, StaffUser } from '../../types';
import {
  ShieldCheck,
  KeyRound,
  Database,
  History,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Lock,
  User,
  AlertCircle,
} from 'lucide-react';

interface StaffSettingsPageProps {
  currentUser: StaffUser;
}

export const StaffSettingsPage: React.FC<StaffSettingsPageProps> = ({ currentUser }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordAlert, setPasswordAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Reset Demo Data state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch('/api/staff/audit-logs', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordAlert(null);

    if (newPassword !== confirmPassword) {
      setPasswordAlert({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordAlert({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch('/api/staff/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setPasswordAlert({ type: 'error', message: json.error || 'Failed to update password.' });
      } else {
        setPasswordAlert({ type: 'success', message: 'Credential updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordAlert({ type: 'error', message: 'Server communication error.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResetDemoData = async () => {
    setResetLoading(true);
    setResetSuccess(null);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch('/api/staff/reset-demo', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();

      if (json.success) {
        setResetSuccess('Demo dataset successfully restored to default sample records!');
        setResetModalOpen(false);
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Error resetting demo data:', err);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-stone-900 font-serif-brand flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-red-700" />
          Security Controls & System Audit Logs
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm">
          Comprehensive traceability of all staff actions, credential modifications, and database reset controls.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{resetSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Security & Demo Reset */}
        <div className="lg:col-span-5 space-y-6">
          {/* Change Password Form */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-red-700" />
              Update Staff Security Credential
            </h3>
            <p className="text-xs text-stone-500">
              Change the administrative password or access code for user <strong>{currentUser.username}</strong>.
            </p>

            {passwordAlert && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  passwordAlert.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-red-50 text-red-900 border border-red-200'
                }`}
              >
                {passwordAlert.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{passwordAlert.message}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Current Security Password / Code
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  New Password / Code
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:bg-stone-400 text-white font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
              >
                {passwordLoading ? 'Updating Credential...' : 'Update Password / Code'}
              </button>
            </form>
          </div>

          {/* Development / Demo Mode Reset Box (Item 28) */}
          <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <Database className="w-5 h-5 text-amber-700" />
              <span>Demo Dataset Management</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              HRK Education System includes a clearly marked demo dataset with sample classes (10th, 9th, 8th), 10-subject transcripts, monthly fee records, and announcements for testing.
            </p>
            <button
              onClick={() => setResetModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload / Reset Demo Records</span>
            </button>
          </div>
        </div>

        {/* Right Column: Full System Audit Log (Item 27) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <History className="w-5 h-5 text-stone-700" />
              Security Audit Trail (Item 27)
            </h3>
            <button
              onClick={fetchAuditLogs}
              className="text-xs text-stone-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {loadingLogs ? (
              <div className="p-8 text-center text-stone-500 text-xs">
                Loading audit trail...
              </div>
            ) : logs.length > 0 ? (
              logs.map((log) => {
                const isDelete = log.action_type.includes('DELETE');
                const isCreate = log.action_type.includes('CREATE') || log.action_type.includes('INITIAL');
                const isUpdate = log.action_type.includes('UPDATE') || log.action_type.includes('CHANGE');

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            isDelete
                              ? 'bg-red-100 text-red-800'
                              : isCreate
                              ? 'bg-emerald-100 text-emerald-800'
                              : isUpdate
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-200 text-stone-800'
                          }`}
                        >
                          {log.action_type}
                        </span>
                        <span className="font-semibold text-stone-900 flex items-center gap-1">
                          <User className="w-3 h-3 text-stone-400" />
                          {log.staff_username}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-stone-700">{log.details}</p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-stone-400 text-xs">
                No logs recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-amber-700">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900">Reset to Demo Dataset?</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600">
              This will reset the SQLite database with the standard demo students (Muhammad Ali, Ayesha Khan, Fatima Noor), 10-subject transcripts, fee records, and circulars. Any custom records you entered will be replaced.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDemoData}
                disabled={resetLoading}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow"
              >
                {resetLoading ? 'Resetting...' : 'Confirm Reset Demo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
