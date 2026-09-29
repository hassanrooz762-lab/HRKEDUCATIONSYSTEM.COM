import React, { useEffect, useState } from 'react';
import { FeeRecord } from '../../types';
import {
  CreditCard,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  XCircle,
  DollarSign,
  Receipt,
  User,
} from 'lucide-react';

export const StaffFeesPage: React.FC = () => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');

  // Form / Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('10th');
  const [month, setMonth] = useState('January 2026');
  const [monthlyFee, setMonthlyFee] = useState<number | string>(5000);
  const [status, setStatus] = useState<'Paid' | 'Unpaid' | 'Partially Paid'>('Paid');
  const [balance, setBalance] = useState<number | string>(0);
  const [receivedBy, setReceivedBy] = useState('Accounts Office');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchFees();
  }, [statusFilter, classFilter]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
      if (classFilter && classFilter !== 'All') params.append('class', classFilter);

      const res = await fetch(`/api/staff/fees?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setFees(json.data);
      }
    } catch (err) {
      console.error('Failed to load fees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setStudentName('');
    setRollNumber('');
    setStudentClass(classFilter !== 'All' ? classFilter : '10th');
    setMonth('March 2026');
    setMonthlyFee(5000);
    setStatus('Unpaid');
    setBalance(5000);
    setReceivedBy('Accounts Office');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (record: FeeRecord) => {
    setEditingId(record.id);
    setStudentName(record.student_name);
    setRollNumber(record.roll_number);
    setStudentClass(record.class);
    setMonth(record.month);
    setMonthlyFee(record.monthly_fee);
    setStatus(record.status);
    setBalance(record.balance);
    setReceivedBy(record.received_by || '');
    setPaymentDate(record.payment_date || '');
    setNotes(record.notes || '');
    setModalOpen(true);
  };

  // Helper when changing status to auto-adjust balance
  const handleStatusChange = (newStatus: 'Paid' | 'Unpaid' | 'Partially Paid') => {
    setStatus(newStatus);
    const feeVal = Number(monthlyFee) || 0;
    if (newStatus === 'Paid') {
      setBalance(0);
    } else if (newStatus === 'Unpaid') {
      setBalance(feeVal);
    }
  };

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!studentName.trim() || !rollNumber.trim() || !month.trim()) {
      setAlert({ type: 'error', message: 'Student Name, Roll Number, Class, and Month are required.' });
      return;
    }

    const feeAmount = Number(monthlyFee);
    const balanceAmount = Number(balance);

    if (isNaN(feeAmount) || feeAmount < 0) {
      setAlert({ type: 'error', message: 'Monthly fee cannot be negative.' });
      return;
    }

    if (isNaN(balanceAmount) || balanceAmount < 0) {
      setAlert({ type: 'error', message: 'Outstanding balance cannot be negative.' });
      return;
    }

    try {
      const token = localStorage.getItem('hrk_staff_token');
      const payload = {
        student_name: studentName.trim(),
        roll_number: rollNumber.trim(),
        class: studentClass.trim(),
        month: month.trim(),
        monthly_fee: feeAmount,
        status,
        balance: balanceAmount,
        received_by: receivedBy.trim() || null,
        payment_date: paymentDate ? paymentDate.trim() : null,
        notes: notes ? notes.trim() : null,
      };

      const url = editingId ? `/api/staff/fees/${editingId}` : '/api/staff/fees';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setAlert({ type: 'error', message: json.error || 'Failed to save fee record.' });
      } else {
        setAlert({
          type: 'success',
          message: editingId
            ? 'Monthly fee record updated in database.'
            : 'New monthly fee voucher recorded and persisted permanently.',
        });
        setModalOpen(false);
        fetchFees();
      }
    } catch (err) {
      console.error('Error saving fee:', err);
      setAlert({ type: 'error', message: 'Failed to communicate with database server.' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch(`/api/staff/fees/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();

      if (json.success) {
        setAlert({ type: 'success', message: 'Fee record permanently deleted.' });
        setDeleteConfirmId(null);
        fetchFees();
      } else {
        setAlert({ type: 'error', message: json.error || 'Failed to delete fee record.' });
      }
    } catch (err) {
      console.error('Error deleting fee record:', err);
      setAlert({ type: 'error', message: 'Deletion failed.' });
    }
  };

  const filtered = fees.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.student_name.toLowerCase().includes(q) ||
      f.roll_number.toLowerCase().includes(q) ||
      f.month.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 font-serif-brand flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-red-700" />
            Monthly Fee Records Management
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Maintain individual monthly billing, payment collection verifications, and balance tracking per student.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Monthly Fee</span>
        </button>
      </div>

      {/* Alert Notice */}
      {alert && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start justify-between gap-3 ${
            alert.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, roll no, or month..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-xs sm:text-sm outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs sm:text-sm font-semibold bg-white outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-600">Class:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs sm:text-sm font-semibold bg-white outline-none"
            >
              <option value="All">All Classes</option>
              <option value="10th">Class 10th</option>
              <option value="9th">Class 9th</option>
              <option value="8th">Class 8th</option>
              <option value="7th">Class 7th</option>
              <option value="6th">Class 6th</option>
              <option value="5th">Class 5th</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-stone-900 text-white text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-4 text-right">Fee (PKR)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Received By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-stone-500">
                    <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading fee ledgers...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((f) => {
                  const isPaid = f.status === 'Paid';
                  const isPartial = f.status === 'Partially Paid';
                  const isUnpaid = f.status === 'Unpaid';

                  return (
                    <tr key={f.id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-red-700">
                        {f.roll_number}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {f.student_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300">
                          {f.class}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-800">
                        {f.month}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-stone-900">
                        Rs. {Number(f.monthly_fee).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isPartial
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {isPaid && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {isPartial && <Clock className="w-3 h-3 text-amber-600" />}
                          {isUnpaid && <XCircle className="w-3 h-3 text-red-600" />}
                          {f.status}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-black ${
                          f.balance > 0 ? 'text-red-700' : 'text-emerald-700'
                        }`}
                      >
                        Rs. {Number(f.balance).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-600">
                        {f.received_by || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(f)}
                            title="Edit Fee Record"
                            className="p-1.5 rounded-lg text-stone-600 hover:text-red-700 hover:bg-stone-100 transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(f.id)}
                            title="Delete Fee Record"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-stone-400 text-xs">
                    No fee records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900">Delete Fee Voucher</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600">
              Are you sure you want to permanently delete this monthly fee record? This will alter the student's payment history in the permanent ledger.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Fee Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp my-8">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 font-serif-brand flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-700" />
                {editingId ? 'Edit Monthly Fee Record' : 'Record Monthly Fee Voucher'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFee} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Student Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Roll Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 101"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Class <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none bg-white"
                  >
                    <option value="10th">Class 10th</option>
                    <option value="9th">Class 9th</option>
                    <option value="8th">Class 8th</option>
                    <option value="7th">Class 7th</option>
                    <option value="6th">Class 6th</option>
                    <option value="5th">Class 5th</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Billing Month <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="e.g. March 2026"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Monthly Fee (Rs.) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-sm font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Status <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value as 'Paid' | 'Unpaid' | 'Partially Paid')}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-sm font-semibold bg-white"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Balance / Outstanding <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-sm font-bold text-red-700 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Received By (Staff / Cashier)
                  </label>
                  <input
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="Staff Name"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Payment Notes / Receipt Slip #
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Paid in cash at counter / Bank Slip #1234"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow"
                >
                  {editingId ? 'Save Changes' : 'Save Fee Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
