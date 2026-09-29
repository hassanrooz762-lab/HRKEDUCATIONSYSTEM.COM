import React, { useEffect, useState } from 'react';
import { StudentRecord } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
} from 'lucide-react';

interface StaffStudentsPageProps {
  onAddResultForStudent?: (student: StudentRecord) => void;
  onAddFeeForStudent?: (student: StudentRecord) => void;
}

export const StaffStudentsPage: React.FC<StaffStudentsPageProps> = ({
  onAddResultForStudent,
  onAddFeeForStudent,
}) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [formName, setFormName] = useState('');
  const [formFatherName, setFormFatherName] = useState('');
  const [formClass, setFormClass] = useState('10th');
  const [formRollNumber, setFormRollNumber] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Status Alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const params = new URLSearchParams();
      if (selectedClass && selectedClass !== 'All') params.append('class', selectedClass);

      const res = await fetch(`/api/staff/students?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student?: StudentRecord) => {
    if (student) {
      setEditingStudent(student);
      setFormName(student.name);
      setFormFatherName(student.father_name);
      setFormClass(student.class);
      setFormRollNumber(student.roll_number);
      setFormPhone(student.phone || '');
      setFormAddress(student.address || '');
    } else {
      setEditingStudent(null);
      setFormName('');
      setFormFatherName('');
      setFormClass(selectedClass !== 'All' ? selectedClass : '10th');
      setFormRollNumber('');
      setFormPhone('');
      setFormAddress('');
    }
    setModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!formName.trim() || !formFatherName.trim() || !formRollNumber.trim()) {
      setAlert({ type: 'error', message: 'Name, Father Name, Class, and Roll Number are required.' });
      return;
    }

    try {
      const token = localStorage.getItem('hrk_staff_token');
      const payload = {
        name: formName.trim(),
        father_name: formFatherName.trim(),
        class: formClass.trim(),
        roll_number: formRollNumber.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim(),
      };

      const url = editingStudent
        ? `/api/staff/students/${editingStudent.id}`
        : '/api/staff/students';
      const method = editingStudent ? 'PUT' : 'POST';

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
        setAlert({ type: 'error', message: json.error || 'Failed to save student record.' });
      } else {
        setAlert({
          type: 'success',
          message: editingStudent
            ? 'Student record successfully updated in permanent database.'
            : 'New student successfully registered and enrolled in database.',
        });
        setModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      console.error('Error saving student:', err);
      setAlert({ type: 'error', message: 'Server communication failed.' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch(`/api/staff/students/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();

      if (json.success) {
        setAlert({ type: 'success', message: 'Student record deleted permanently.' });
        setDeleteConfirmId(null);
        fetchStudents();
      } else {
        setAlert({ type: 'error', message: json.error || 'Failed to delete student.' });
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      setAlert({ type: 'error', message: 'Failed to process deletion.' });
    }
  };

  const filtered = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.father_name.toLowerCase().includes(q) ||
      s.roll_number.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 font-serif-brand flex items-center gap-2">
            <Users className="w-6 h-6 text-red-700" />
            Student Enrollment Directory
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Maintain official student database, roll number registry, parent contacts, and admission records.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
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

      {/* Search & Class Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, father name, or roll no..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-xs sm:text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-600 whitespace-nowrap">Filter Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
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

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-stone-900 text-white text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Father Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-stone-500">
                    <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading enrolled students...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-red-700">
                      {s.roll_number}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {s.father_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300">
                        {s.class}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600">
                      {s.phone || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-500 max-w-xs truncate">
                      {s.address || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(s)}
                          title="Edit Student"
                          className="p-1.5 rounded-lg text-stone-600 hover:text-red-700 hover:bg-stone-100 transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(s.id)}
                          title="Delete Student"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-stone-400 text-xs">
                    No students found matching your criteria.
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
              <h3 className="text-lg font-bold text-stone-900">Confirm Student Deletion</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600">
              Are you sure you want to permanently delete this student record? This action will also unlink related exam transcripts and fee records.
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

      {/* Add / Edit Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp my-8">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 font-serif-brand flex items-center gap-2">
                <Users className="w-5 h-5 text-red-700" />
                {editingStudent ? 'Edit Student Record' : 'Enroll New Student'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Student Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Father Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formFatherName}
                    onChange={(e) => setFormFatherName(e.target.value)}
                    placeholder="Father Name"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Class <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none bg-white"
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
                    Roll Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formRollNumber}
                    onChange={(e) => setFormRollNumber(e.target.value)}
                    placeholder="e.g. 104"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Parent / Guardian Contact Phone
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. 0300-1234567"
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. Peshawar Cantt"
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 text-sm outline-none"
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
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
