import React, { useEffect, useState } from 'react';
import { StaffUser, AuditLog } from '../../types';
import {
  Users,
  FileText,
  CreditCard,
  Bell,
  AlertTriangle,
  PlusCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface StaffDashboardProps {
  currentUser: StaffUser;
  onNavigateTab: (tab: string) => void;
}

interface DashboardStats {
  totalStudents: number;
  totalResults: number;
  totalFeeRecords: number;
  unpaidCount: number;
  totalOutstandingBalance: number;
  totalNotifications: number;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  onNavigateTab,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAudit, setRecentAudit] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch('/api/staff/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data.stats);
        setRecentAudit(json.data.recentAudit || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 border border-red-700/50 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif-brand">
            Welcome back, {currentUser.displayName || currentUser.username}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-1">
            HRK Education System • Main Campus, Peshawar Cantt • Session 2025–2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('results')}
            className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-1.5 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Result</span>
          </button>
          <button
            onClick={() => onNavigateTab('fees')}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-yellow-400 border border-stone-700 font-bold text-xs uppercase tracking-wider shadow flex items-center gap-1.5 transition cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Post Fee</span>
          </button>
        </div>
      </div>

      {/* 5 Primary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-red-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Students</span>
            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-stone-900">
              {loading ? '...' : stats?.totalStudents ?? 0}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Enrolled across classes</div>
          </div>
        </div>

        {/* Card 2: Results */}
        <div
          onClick={() => onNavigateTab('results')}
          className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-yellow-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Total Results</span>
            <div className="w-9 h-9 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-stone-900">
              {loading ? '...' : stats?.totalResults ?? 0}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Published Transcripts</div>
          </div>
        </div>

        {/* Card 3: Fee Records */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-blue-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Fee Records</span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-stone-900">
              {loading ? '...' : stats?.totalFeeRecords ?? 0}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Monthly billings</div>
          </div>
        </div>

        {/* Card 4: Unpaid Dues */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-red-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">Unpaid Fees</span>
            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-red-700">
              {loading ? '...' : `Rs. ${(stats?.totalOutstandingBalance ?? 0).toLocaleString()}`}
            </div>
            <div className="text-[11px] text-red-600 font-semibold mt-0.5">
              {stats?.unpaidCount ?? 0} vouchers pending
            </div>
          </div>
        </div>

        {/* Card 5: Notifications */}
        <div
          onClick={() => onNavigateTab('notifications')}
          className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-purple-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Circulars</span>
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-stone-900">
              {loading ? '...' : stats?.totalNotifications ?? 0}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Published & drafts</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Shortcuts & Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Management Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-700" />
              Quick Management Shortcuts
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('students')}
                className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-red-50 border border-stone-200 hover:border-red-300 text-stone-800 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-red-700" />
                  <span>Enrolled Students & Roll Numbers</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => onNavigateTab('results')}
                className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-yellow-50 border border-stone-200 hover:border-yellow-300 text-stone-800 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-yellow-700" />
                  <span>Enter / Edit 10-Subject Marksheet</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => onNavigateTab('fees')}
                className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-blue-50 border border-stone-200 hover:border-blue-300 text-stone-800 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-blue-700" />
                  <span>Post Monthly Fee Collection Record</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => onNavigateTab('notifications')}
                className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-purple-50 border border-stone-200 hover:border-purple-300 text-stone-800 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-purple-700" />
                  <span>Publish School Notice / Holiday</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                  <span>Security & System Audit Logs</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Audit Log Feed */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Recent Staff Operations & Audit Log
            </h3>
            <button
              onClick={() => onNavigateTab('settings')}
              className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
            >
              View Full Audit Trail &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recentAudit.length > 0 ? (
              recentAudit.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-800 text-[10px]">
                        {log.action_type}
                      </span>
                      <span className="text-stone-500">•</span>
                      <span className="font-semibold text-stone-900">
                        {log.staff_username}
                      </span>
                    </div>
                    <p className="text-stone-700 font-medium">{log.details}</p>
                  </div>
                  <div className="text-[11px] text-stone-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-stone-400 text-xs">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
