import React, { useEffect, useState } from 'react';
import { AdmissionApplication } from '../../types';
import {
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  Printer,
  Trash2,
  Edit2,
  Filter,
  Eye,
  X,
} from 'lucide-react';

export const StaffAdmissionsPage: React.FC = () => {
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');

  // Selected admission for status modal / review
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [newStatus, setNewStatus] = useState<'Pending' | 'Approved' | 'Interview Scheduled' | 'Rejected'>('Pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter, classFilter]);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (classFilter !== 'All') params.append('class', classFilter);

      const res = await fetch(`/api/staff/admissions?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setAdmissions(json.data);
      }
    } catch (err) {
      console.error('Error fetching admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdmissions();
  };

  const handleOpenReview = (app: AdmissionApplication) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNotes(app.notes || '');
    setMessage(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch(`/api/staff/admissions/${selectedApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus, notes: adminNotes }),
      });
      const json = await res.json();

      if (json.success) {
        setMessage({ type: 'success', text: 'Admission status updated successfully!' });
        fetchAdmissions();
        setTimeout(() => setSelectedApp(null), 1200);
      } else {
        setMessage({ type: 'error', text: json.error || 'Failed to update status' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error contacting server' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number, appNo: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete application ${appNo}?`)) return;

    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch(`/api/staff/admissions/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setAdmissions((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(json.error || 'Failed to delete application');
      }
    } catch {
      alert('Network error while deleting');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-700 mb-1">
            <UserPlus className="w-4 h-4 text-red-700" />
            <span>Enrollment & Applicant Desk</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 font-serif-brand">
            Online Admission Applications
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Review online applications submitted by parents, schedule interviews, and assign admission status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-red-50 text-red-800 px-4 py-2 rounded-xl border border-red-200 text-xs font-bold">
            Total Applications: {admissions.length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[260px] flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, father name, phone, or application #..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 focus:border-red-700 text-xs sm:text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium outline-none bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-semibold">
            <span>Class:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium outline-none bg-white"
            >
              <option value="All">All Classes</option>
              <option value="Playgroup">Playgroup</option>
              <option value="Nursery">Nursery</option>
              <option value="Prep">Prep</option>
              <option value="Class 1st">Class 1st</option>
              <option value="Class 2nd">Class 2nd</option>
              <option value="Class 3rd">Class 3rd</option>
              <option value="Class 4th">Class 4th</option>
              <option value="Class 5th">Class 5th</option>
              <option value="Class 6th">Class 6th</option>
              <option value="Class 7th">Class 7th</option>
              <option value="Class 8th">Class 8th</option>
              <option value="9th (Science)">9th (Science)</option>
              <option value="10th (Science)">10th (Science)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500 text-sm">
            <div className="w-8 h-8 border-3 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading admission applications...
          </div>
        ) : admissions.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm space-y-2">
            <UserPlus className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="font-semibold">No admission applications match your query.</p>
            <p className="text-xs text-stone-400">Applications submitted through the public portal will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-900 text-white text-xs uppercase tracking-wider font-bold">
                  <th className="p-3.5">App #</th>
                  <th className="p-3.5">Student & Father</th>
                  <th className="p-3.5">Applied Class</th>
                  <th className="p-3.5">Contact Phone</th>
                  <th className="p-3.5">Date Submitted</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
                {admissions.map((app) => (
                  <tr key={app.id} className="hover:bg-red-50/40 transition">
                    <td className="p-3.5 font-mono font-bold text-red-700">
                      {app.application_no}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-stone-900">{app.student_name}</div>
                      <div className="text-xs text-stone-500">S/D of: {app.father_name}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-stone-800">
                      {app.applied_class}
                    </td>
                    <td className="p-3.5 font-mono text-stone-700">
                      <a href={`tel:${app.phone}`} className="hover:text-red-700 hover:underline">
                        {app.phone}
                      </a>
                    </td>
                    <td className="p-3.5 text-stone-500 text-xs">
                      {app.submitted_at?.split('T')[0]}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : app.status === 'Interview Scheduled'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : app.status === 'Rejected'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenReview(app)}
                          className="px-2.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Review / Update Status"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleDelete(app.id, app.application_no)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition rounded-lg"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Status Update Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-red-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs uppercase font-bold text-red-700 tracking-wider">
                  Admission Application Review
                </span>
                <h2 className="text-xl font-black text-stone-900 font-serif-brand">
                  {selectedApp.student_name} ({selectedApp.applied_class})
                </h2>
                <div className="text-xs font-mono text-stone-500">Ref: {selectedApp.application_no}</div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Profile Information */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs sm:text-sm space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-500 block">Father Name:</span>
                  <strong className="text-stone-900">{selectedApp.father_name}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Father CNIC:</span>
                  <span className="font-mono text-stone-900">{selectedApp.father_cnic || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Contact Phone:</span>
                  <span className="font-mono text-stone-900">{selectedApp.phone}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Date of Birth:</span>
                  <span>{selectedApp.dob || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Previous School:</span>
                  <span>{selectedApp.previous_school || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Previous Marks:</span>
                  <span>{selectedApp.previous_marks || 'N/A'}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="text-stone-500 block">Residential Address:</span>
                <span className="text-stone-800">{selectedApp.address}</span>
              </div>
            </div>

            {/* Status Change Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1.5">
                  Update Application Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-3 rounded-xl border-2 border-stone-300 focus:border-red-700 text-sm font-bold outline-none"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Approved">Approved / Admission Confirmed</option>
                  <option value="Rejected">Rejected / Ineligible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1.5">
                  Admissions Office Remarks / Interview Schedule Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Interview scheduled for Saturday 10:00 AM with Principal Hassan Rooz. Please bring original Form-B."
                  className="w-full p-3 rounded-xl border-2 border-stone-300 focus:border-red-700 text-xs sm:text-sm outline-none"
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-red-50 text-red-800 border border-red-300'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleUpdateStatus}
                  className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:bg-stone-400 text-white text-xs font-bold shadow transition cursor-pointer"
                >
                  {updating ? 'Saving...' : 'Save Status Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
