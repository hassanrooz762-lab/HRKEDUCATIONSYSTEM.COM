import React, { useEffect, useState } from 'react';
import { StudentResult, SubjectRow } from '../../types';
import {
  FileText,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  Sparkles,
  Calculator,
  Eye,
  Info,
} from 'lucide-react';

export const StaffResultsPage: React.FC = () => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  // Form / Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalResult, setViewModalResult] = useState<StudentResult | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Student Identity Fields
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [studentClass, setStudentClass] = useState('10th');
  const [rollNumber, setRollNumber] = useState('');
  const [examTitle, setExamTitle] = useState('Annual Examination');
  const [examSession, setExamSession] = useState('2025-2026');

  // 10 Configurable Subject Rows
  const defaultSubjects: SubjectRow[] = [
    { slot_number: 1, subject_name: 'English Compulsory', attendance_marks: 20, obtained_marks: '', total_marks: 100 },
    { slot_number: 2, subject_name: 'Urdu', attendance_marks: 20, obtained_marks: '', total_marks: 100 },
    { slot_number: 3, subject_name: 'Mathematics', attendance_marks: 20, obtained_marks: '', total_marks: 100 },
    { slot_number: 4, subject_name: 'Physics', attendance_marks: 20, obtained_marks: '', total_marks: 100 },
    { slot_number: 5, subject_name: 'Chemistry', attendance_marks: 20, obtained_marks: '', total_marks: 100 },
    { slot_number: 6, subject_name: 'Biology / Computer', attendance_marks: 20, obtained_marks: '', total_marks: 100 },
    { slot_number: 7, subject_name: 'Islamiyat', attendance_marks: 20, obtained_marks: '', total_marks: 50 },
    { slot_number: 8, subject_name: 'Pakistan Studies', attendance_marks: 20, obtained_marks: '', total_marks: 50 },
    { slot_number: 9, subject_name: 'Tarjuma-tul-Quran', attendance_marks: 20, obtained_marks: '', total_marks: 50 },
    { slot_number: 10, subject_name: '', attendance_marks: '', obtained_marks: '', total_marks: '' },
  ];
  const [subjectRows, setSubjectRows] = useState<SubjectRow[]>(defaultSubjects);

  // Performance Fields
  const [paperPercentage, setPaperPercentage] = useState<string>('');
  const [position, setPosition] = useState('');
  const [remarks, setRemarks] = useState('');

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchResults();
  }, [selectedClass]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const params = new URLSearchParams();
      if (selectedClass && selectedClass !== 'All') params.append('class', selectedClass);

      const res = await fetch(`/api/staff/results?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      }
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  // Live Automatic Calculations
  const calculatedTotalObtained = subjectRows.reduce((acc, row) => {
    const val = Number(row.obtained_marks);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const calculatedTotalMarks = subjectRows.reduce((acc, row) => {
    if (!row.subject_name.trim()) return acc;
    const val = Number(row.total_marks);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const calculatedPercentage =
    calculatedTotalMarks > 0
      ? parseFloat(((calculatedTotalObtained / calculatedTotalMarks) * 100).toFixed(2))
      : 0;

  const handleOpenAdd = () => {
    setEditingId(null);
    setStudentName('');
    setFatherName('');
    setStudentClass(selectedClass !== 'All' ? selectedClass : '10th');
    setRollNumber('');
    setExamTitle('Annual Examination');
    setExamSession('2025-2026');
    setSubjectRows(defaultSubjects);
    setPaperPercentage('');
    setPosition('');
    setRemarks('');
    setModalOpen(true);
  };

  const handleOpenEdit = (res: StudentResult) => {
    setEditingId(res.id || null);
    setStudentName(res.student_name);
    setFatherName(res.father_name);
    setStudentClass(res.class);
    setRollNumber(res.roll_number);
    setExamTitle(res.exam_title || 'Annual Examination');
    setExamSession(res.exam_session || '2025-2026');

    // Populate up to 10 slots
    const loadedRows: SubjectRow[] = [];
    for (let i = 1; i <= 10; i++) {
      const match = res.subjects?.find((s) => Number(s.slot_number) === i);
      if (match) {
        loadedRows.push({
          slot_number: i,
          subject_name: match.subject_name,
          attendance_marks: match.attendance_marks ?? '',
          obtained_marks: match.obtained_marks,
          total_marks: match.total_marks,
        });
      } else {
        loadedRows.push({
          slot_number: i,
          subject_name: '',
          attendance_marks: '',
          obtained_marks: '',
          total_marks: '',
        });
      }
    }
    setSubjectRows(loadedRows);
    setPaperPercentage(res.paper_percentage !== null && res.paper_percentage !== undefined ? String(res.paper_percentage) : '');
    setPosition(res.position || '');
    setRemarks(res.remarks || '');
    setModalOpen(true);
  };

  const handleSubjectChange = (index: number, field: keyof SubjectRow, value: string | number) => {
    const updated = [...subjectRows];
    updated[index] = { ...updated[index], [field]: value };
    setSubjectRows(updated);
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!studentName.trim() || !fatherName.trim() || !rollNumber.trim() || !studentClass.trim()) {
      setAlert({ type: 'error', message: 'Student Name, Father Name, Class, and Roll Number are required.' });
      return;
    }

    // Filter valid non-empty subject rows
    const filledSubjects = subjectRows.filter((r) => r.subject_name.trim() !== '');
    if (filledSubjects.length === 0) {
      setAlert({ type: 'error', message: 'Please enter marks for at least one subject.' });
      return;
    }

    // Validate marks
    for (const sub of filledSubjects) {
      const obt = Number(sub.obtained_marks);
      const tot = Number(sub.total_marks);
      if (isNaN(tot) || tot <= 0) {
        setAlert({ type: 'error', message: `Subject "${sub.subject_name}": Total marks must be greater than 0.` });
        return;
      }
      if (isNaN(obt) || obt < 0) {
        setAlert({ type: 'error', message: `Subject "${sub.subject_name}": Obtained marks cannot be negative.` });
        return;
      }
      if (obt > tot) {
        setAlert({
          type: 'error',
          message: `Subject "${sub.subject_name}": Obtained marks (${obt}) cannot exceed Total marks (${tot}).`,
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem('hrk_staff_token');
      const payload = {
        student_name: studentName.trim(),
        father_name: fatherName.trim(),
        class: studentClass.trim(),
        roll_number: rollNumber.trim(),
        exam_title: examTitle.trim(),
        exam_session: examSession.trim(),
        paper_percentage: paperPercentage !== '' ? Number(paperPercentage) : null,
        position: position.trim() || null,
        remarks: remarks.trim() || null,
        subjects: filledSubjects.map((s, idx) => ({
          slot_number: s.slot_number || idx + 1,
          subject_name: s.subject_name.trim(),
          attendance_marks: Number(s.attendance_marks) || 0,
          obtained_marks: Number(s.obtained_marks),
          total_marks: Number(s.total_marks),
        })),
      };

      const url = editingId ? `/api/staff/results/${editingId}` : '/api/staff/results';
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
        setAlert({ type: 'error', message: json.error || 'Failed to save examination result.' });
      } else {
        setAlert({
          type: 'success',
          message: editingId
            ? 'Examination result updated successfully and saved to permanent database.'
            : 'New examination transcript created and persisted to database.',
        });
        setModalOpen(false);
        fetchResults();
      }
    } catch (err) {
      console.error('Error saving result:', err);
      setAlert({ type: 'error', message: 'Failed to contact database server.' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch(`/api/staff/results/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();

      if (json.success) {
        setAlert({ type: 'success', message: 'Examination result record permanently removed.' });
        setDeleteConfirmId(null);
        fetchResults();
      } else {
        setAlert({ type: 'error', message: json.error || 'Failed to delete result.' });
      }
    } catch (err) {
      console.error('Error deleting result:', err);
      setAlert({ type: 'error', message: 'Failed to process deletion.' });
    }
  };

  const filtered = results.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.student_name.toLowerCase().includes(q) ||
      r.father_name.toLowerCase().includes(q) ||
      r.roll_number.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 font-serif-brand flex items-center gap-2">
            <FileText className="w-6 h-6 text-red-700" />
            Result & Marksheet Management
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Enter marks for up to 10 configurable subjects, with live automatic percentage calculation and staff remarks.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Result</span>
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

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcripts by student or roll no..."
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

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-stone-900 text-white text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Father Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Subjects</th>
                <th className="py-3 px-4 text-center">Marks</th>
                <th className="py-3 px-4 text-center">Overall %</th>
                <th className="py-3 px-4 text-center">Paper %</th>
                <th className="py-3 px-4 text-center">Position</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-stone-500">
                    <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading examination transcripts...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-red-700">
                      {r.roll_number}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {r.student_name}
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {r.father_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300">
                        {r.class}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-stone-600">
                      {r.subjects?.length || 0} slots
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-stone-800">
                      {r.total_obtained} / {r.total_marks}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
                        {r.overall_percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-stone-600">
                      {r.paper_percentage !== null && r.paper_percentage !== undefined ? `${r.paper_percentage}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-bold text-yellow-800">
                      {r.position || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewModalResult(r)}
                          title="View Marksheet"
                          className="p-1.5 rounded-lg text-stone-600 hover:text-blue-700 hover:bg-stone-100 transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(r)}
                          title="Edit Transcript"
                          className="p-1.5 rounded-lg text-stone-600 hover:text-red-700 hover:bg-stone-100 transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(r.id || null)}
                          title="Delete Result"
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
                  <td colSpan={10} className="text-center py-10 text-stone-400 text-xs">
                    No results found matching your criteria.
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
              <h3 className="text-lg font-bold text-stone-900">Delete Marksheet Record</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600">
              Are you sure you want to permanently delete this examination transcript? Parents and students will no longer be able to look it up on the public portal.
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

      {/* View Modal */}
      {viewModalResult && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp my-8">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 font-serif-brand">
                Transcript View: {viewModalResult.student_name} (Roll: {viewModalResult.roll_number})
              </h3>
              <button onClick={() => setViewModalResult(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div><span className="text-stone-400 block">Father:</span><strong>{viewModalResult.father_name}</strong></div>
              <div><span className="text-stone-400 block">Class:</span><strong>{viewModalResult.class}</strong></div>
              <div><span className="text-stone-400 block">Total Marks:</span><strong>{viewModalResult.total_obtained} / {viewModalResult.total_marks}</strong></div>
              <div><span className="text-stone-400 block">Percentage:</span><strong className="text-red-700">{viewModalResult.overall_percentage}%</strong></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-stone-200">
                <thead>
                  <tr className="bg-stone-100 font-bold text-stone-800">
                    <th className="p-2 border border-stone-200">Slot</th>
                    <th className="p-2 border border-stone-200">Subject Name</th>
                    <th className="p-2 border border-stone-200 text-center">Attendance</th>
                    <th className="p-2 border border-stone-200 text-center">Total</th>
                    <th className="p-2 border border-stone-200 text-center">Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {viewModalResult.subjects?.map((s, idx) => (
                    <tr key={idx} className="border-b border-stone-100">
                      <td className="p-2 border border-stone-200 text-stone-500">{s.slot_number || idx + 1}</td>
                      <td className="p-2 border border-stone-200 font-semibold">{s.subject_name}</td>
                      <td className="p-2 border border-stone-200 text-center">{s.attendance_marks ?? '—'}</td>
                      <td className="p-2 border border-stone-200 text-center">{s.total_marks}</td>
                      <td className="p-2 border border-stone-200 text-center font-bold text-stone-900">{s.obtained_marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-xl">
              <div><span className="text-stone-400 block">Paper %:</span><strong>{viewModalResult.paper_percentage ?? '—'}%</strong></div>
              <div><span className="text-stone-400 block">Position:</span><strong>{viewModalResult.position || '—'}</strong></div>
              <div><span className="text-stone-400 block">Remarks:</span><strong className="italic">{viewModalResult.remarks || 'None'}</strong></div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setViewModalResult(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Marksheet Modal (Up to 10 configurable subjects) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp my-8">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-serif-brand flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-red-700" />
                  {editingId ? 'Edit Student Marksheet' : 'Add New Student Marksheet'}
                </h3>
                <p className="text-xs text-stone-500">
                  Configure up to 10 subject slots. Automatic calculation updates live as you type.
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-6">
              {/* Student Identity Row */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Student Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs sm:text-sm font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Father Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Father Name"
                    required
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs sm:text-sm font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Class <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs sm:text-sm font-medium bg-white"
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Roll Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 105"
                    required
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs sm:text-sm font-mono font-bold bg-white"
                  />
                </div>
              </div>

              {/* 10 Subject Slots Table */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    10 Configurable Subject Slots (Leave empty slots blank)
                  </h4>
                  <span className="text-[11px] text-stone-500">Subject names are custom and not hardcoded</span>
                </div>

                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100 font-bold text-stone-700 border-b border-stone-200">
                        <th className="py-2 px-3 w-10 text-center">#</th>
                        <th className="py-2 px-3">Subject Name</th>
                        <th className="py-2 px-3 w-28 text-center">Attendance Marks</th>
                        <th className="py-2 px-3 w-28 text-center">Total Marks</th>
                        <th className="py-2 px-3 w-28 text-center">Obtained Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {subjectRows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                          <td className="py-2 px-3 text-center font-bold text-stone-400">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.subject_name}
                              onChange={(e) => handleSubjectChange(idx, 'subject_name', e.target.value)}
                              placeholder={`Subject ${idx + 1} Name (e.g. English, Urdu, Math)`}
                              className="w-full px-2.5 py-1.5 rounded border border-stone-300 focus:border-red-600 text-xs font-medium"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0"
                              value={row.attendance_marks}
                              onChange={(e) => handleSubjectChange(idx, 'attendance_marks', e.target.value)}
                              placeholder="Att."
                              className="w-full px-2 py-1.5 rounded border border-stone-300 focus:border-red-600 text-xs text-center"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="1"
                              value={row.total_marks}
                              onChange={(e) => handleSubjectChange(idx, 'total_marks', e.target.value)}
                              placeholder="Total"
                              className="w-full px-2 py-1.5 rounded border border-stone-300 focus:border-red-600 text-xs text-center font-semibold"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0"
                              value={row.obtained_marks}
                              onChange={(e) => handleSubjectChange(idx, 'obtained_marks', e.target.value)}
                              placeholder="Obt."
                              className="w-full px-2 py-1.5 rounded border border-stone-300 focus:border-red-600 text-xs text-center font-bold text-stone-900 bg-yellow-50/50"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Automatic Calculations Banner */}
              <div className="bg-stone-900 text-white p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="border-b sm:border-b-0 sm:border-r border-stone-800 pb-2 sm:pb-0">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Obtained Marks</span>
                  <span className="text-2xl font-black text-yellow-400">{calculatedTotalObtained}</span>
                </div>
                <div className="border-b sm:border-b-0 sm:border-r border-stone-800 pb-2 sm:pb-0">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Max Marks</span>
                  <span className="text-2xl font-black text-stone-200">{calculatedTotalMarks}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Automatic Percentage</span>
                  <span className="text-2xl font-black text-emerald-400">{calculatedPercentage}%</span>
                </div>
              </div>

              {/* Configurable Attributes: Paper %, Position, Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Paper Percentage (Staff Configurable)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={paperPercentage}
                    onChange={(e) => setPaperPercentage(e.target.value)}
                    placeholder="e.g. 85.5"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs sm:text-sm bg-white"
                  />
                  <span className="text-[10px] text-stone-400">Written exam weighting</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Class Position (Manual Entry)
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. 1st Position or 2nd"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs sm:text-sm bg-white"
                  />
                  <span className="text-[10px] text-stone-400">Staff assigned standing</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Teacher Remarks
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Excellent, Very Good"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:border-red-600 text-xs sm:text-sm bg-white"
                  />
                  <span className="text-[10px] text-stone-400">Controller evaluation remarks</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                  <span>Save Result to Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
