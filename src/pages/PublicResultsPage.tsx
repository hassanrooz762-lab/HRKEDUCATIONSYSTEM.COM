import React, { useState } from 'react';
import { Crest } from '../components/Crest';
import { StudentResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Printer,
  Award,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export const PublicResultsPage: React.FC = () => {
  const { t, isUrdu } = useLanguage();

  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [studentClass, setStudentClass] = useState('10th');
  const [rollNumber, setRollNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StudentResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!studentName.trim() || !fatherName.trim() || !rollNumber.trim()) {
      setError(isUrdu ? 'برائے مہربانی طالب علم کا نام، والد کا نام، کلاس اور رول نمبر درج کریں۔' : 'Please fill in Student Name, Father Name, Class, and Roll Number.');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        studentName: studentName.trim(),
        fatherName: fatherName.trim(),
        class: studentClass.trim(),
        rollNumber: rollNumber.trim(),
      });

      const res = await fetch(`/api/public/results?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || (isUrdu ? 'کوئی امتحانی ریکارڈ نہیں ملا۔ برائے مہربانی کوائف چیک کریں۔' : 'No examination record found for the provided credentials.'));
      } else {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Error fetching result:', err);
      setError(isUrdu ? 'سرور سے رابطہ قائم نہیں ہو سکا۔ برائے مہربانی انٹرنیٹ چیک کریں۔' : 'A connection error occurred while contacting the school examination server.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadDemo = (sName: string, fName: string, sClass: string, rNum: string) => {
    setStudentName(sName);
    setFatherName(fName);
    setStudentClass(sClass);
    setRollNumber(rNum);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-2 no-print">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4 text-red-700" />
          <span>{isUrdu ? 'امتحانی بورڈ و مارک شیٹ پورٹل' : 'Official Examination Board'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif-brand">
          {t('resultsTitle')}
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          {t('resultsSub')}
        </p>
      </div>

      {/* Search Form Card */}
      <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-6 sm:p-8 no-print">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                {t('studentName')} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={isUrdu ? 'مثلاً محمد علی' : 'e.g. Muhammad Ali'}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium text-stone-900 outline-none transition"
              />
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                {t('fatherName')} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder={isUrdu ? 'مثلاً طارق محمود' : 'e.g. Tariq Mahmood'}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium text-stone-900 outline-none transition"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                {t('classLabel')} <span className="text-red-600">*</span>
              </label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium text-stone-900 outline-none transition bg-white"
              >
                <option value="10th">{isUrdu ? 'دسویں کلاس (میٹرک)' : 'Class 10th (Matric)'}</option>
                <option value="9th">{isUrdu ? 'نویں کلاس (نہم)' : 'Class 9th (SSC-I)'}</option>
                <option value="8th">{isUrdu ? 'آٹھویں کلاس (مڈل)' : 'Class 8th (Middle)'}</option>
                <option value="7th">{isUrdu ? 'ساتویں کلاس' : 'Class 7th'}</option>
                <option value="6th">{isUrdu ? 'چھٹی کلاس' : 'Class 6th'}</option>
                <option value="5th">{isUrdu ? 'پانچویں کلاس' : 'Class 5th'}</option>
              </select>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                {t('rollNumber')} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 101"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium text-stone-900 outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-stone-100">
            {/* Quick Demo Pre-fill Links */}
            <div className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-stone-700">{isUrdu ? 'فوری ٹیسٹ:' : 'Quick Test:'}</span>
              <button
                type="button"
                onClick={() => handleLoadDemo('Muhammad Ali', 'Tariq Mahmood', '10th', '101')}
                className="text-red-700 hover:underline font-medium cursor-pointer"
              >
                Ali (Roll 101)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleLoadDemo('Ayesha Khan', 'Rahim Ullah Khan', '10th', '102')}
                className="text-red-700 hover:underline font-medium cursor-pointer"
              >
                Ayesha (Roll 102)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleLoadDemo('Fatima Noor', 'Noor Mohammad', '9th', '201')}
                className="text-red-700 hover:underline font-medium cursor-pointer"
              >
                Fatima (Roll 201)
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-red-700 hover:bg-red-800 disabled:bg-stone-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('verifyingRecord')}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-yellow-300" />
                  <span>{t('searchResultBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">{isUrdu ? 'توجہ فرمائیں' : 'Result Verification Notice'}</div>
              <div>{error}</div>
              <div className="text-xs text-red-600 pt-1">
                {isUrdu
                  ? 'برائے مہربانی تصدیق کریں کہ رول نمبر، کلاس اور نام اسکول کے ریکارڈ کے مطابق درست درج کیے گئے ہیں۔'
                  : 'Please double check that Student Name, Father Name, Class, and Roll Number match your school admission slip.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Result Display Marksheet (School Board Style + High Quality Print) */}
      {result && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-800 p-6 sm:p-10 printable-card relative overflow-hidden animate-fadeIn">
          {/* Print Action in Header (Hidden when printing) */}
          <div className="flex justify-between items-center pb-6 mb-6 border-b-2 border-stone-200 no-print">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>{isUrdu ? 'سرکاری تعلیمی مارک شیٹ تصدیق شدہ' : 'Official Marksheet Verified & Retrieved'}</span>
            </div>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-yellow-400 font-bold text-sm shadow flex items-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printTranscript')}</span>
            </button>
          </div>

          {/* School Header on Transcript */}
          <div className="text-center pb-6 border-b-2 border-stone-300 space-y-2">
            <div className="flex justify-center mb-2">
              <Crest size="lg" />
            </div>
            <div className="text-xs tracking-widest uppercase font-bold text-stone-600">
              {isUrdu ? 'مین روڈ، نزد رس شادی ہال، پشاور کینٹ، خیبر پختونخوا' : 'Main Road, Near to Ras Shadi Hall, Peshawar Cantt, Pakistan'}
            </div>
            <div className="text-sm font-semibold text-red-800">
              Helpline: 0300-0598873 / 0300-5442333 • Principal: Hassan Rooz (حسن روز)
            </div>
            <div className="inline-block mt-2 px-6 py-1.5 rounded-lg bg-stone-900 text-white font-serif-brand font-bold text-base sm:text-lg tracking-wider">
              {result.exam_title || 'ANNUAL EXAMINATION'} — SESSION {result.exam_session || '2025-2026'}
            </div>
          </div>

          {/* Student Identity Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 text-sm border-b border-stone-200 bg-stone-50/70 p-4 rounded-xl my-6">
            <div>
              <span className="text-xs uppercase text-stone-500 block font-semibold">{t('studentName')}:</span>
              <strong className="text-stone-900 text-base">{result.student_name}</strong>
            </div>
            <div>
              <span className="text-xs uppercase text-stone-500 block font-semibold">{t('fatherName')}:</span>
              <strong className="text-stone-900 text-base">{result.father_name}</strong>
            </div>
            <div>
              <span className="text-xs uppercase text-stone-500 block font-semibold">{t('classLabel')}:</span>
              <strong className="text-red-700 text-base">{result.class}</strong>
            </div>
            <div>
              <span className="text-xs uppercase text-stone-500 block font-semibold">{t('rollNumber')}:</span>
              <strong className="text-red-700 text-base font-mono">{result.roll_number}</strong>
            </div>
          </div>

          {/* Configurable Subject Marks Table (Up to 10 subject slots) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse border border-stone-300">
              <thead>
                <tr className="bg-red-800 text-white text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 border border-red-900 w-12 text-center">#</th>
                  <th className="py-3 px-4 border border-red-900">{t('subjectCol')}</th>
                  <th className="py-3 px-4 border border-red-900 text-center w-28">{t('attCol')}</th>
                  <th className="py-3 px-4 border border-red-900 text-center w-28">{t('totalCol')}</th>
                  <th className="py-3 px-4 border border-red-900 text-center w-28">{t('obtCol')}</th>
                  <th className="py-3 px-4 border border-red-900 text-center w-24">{t('gradeCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {result.subjects && result.subjects.length > 0 ? (
                  result.subjects.map((sub, idx) => {
                    const obt = Number(sub.obtained_marks) || 0;
                    const tot = Number(sub.total_marks) || 0;
                    const subPct = tot > 0 ? (obt / tot) * 100 : 0;
                    let grade = 'F';
                    if (subPct >= 80) grade = 'A+';
                    else if (subPct >= 70) grade = 'A';
                    else if (subPct >= 60) grade = 'B';
                    else if (subPct >= 50) grade = 'C';
                    else if (subPct >= 40) grade = 'D';

                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-2.5 px-4 border border-stone-300 text-center font-bold text-stone-500 font-mono">
                          {sub.slot_number || idx + 1}
                        </td>
                        <td className="py-2.5 px-4 border border-stone-300 font-semibold text-stone-800">
                          {sub.subject_name}
                        </td>
                        <td className="py-2.5 px-4 border border-stone-300 text-center text-stone-600 font-mono">
                          {sub.attendance_marks !== undefined && sub.attendance_marks !== ''
                            ? `${sub.attendance_marks}`
                            : '—'}
                        </td>
                        <td className="py-2.5 px-4 border border-stone-300 text-center font-bold text-stone-700 font-mono">
                          {tot}
                        </td>
                        <td className="py-2.5 px-4 border border-stone-300 text-center font-extrabold text-stone-900 font-mono">
                          {obt}
                        </td>
                        <td className="py-2.5 px-4 border border-stone-300 text-center font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-mono ${
                              subPct >= 60
                                ? 'bg-emerald-100 text-emerald-800'
                                : subPct >= 40
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-stone-400">
                      No subject scores recorded.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Grand Total Row */}
              <tfoot>
                <tr className="bg-stone-100 font-bold text-stone-900 text-sm border-t-2 border-stone-400">
                  <td colSpan={3} className="py-3 px-4 text-right uppercase border border-stone-300">
                    {t('grandTotal')}:
                  </td>
                  <td className="py-3 px-4 text-center text-base border border-stone-300 text-stone-800 font-mono">
                    {result.total_marks}
                  </td>
                  <td className="py-3 px-4 text-center text-base border border-stone-300 text-red-800 font-black font-mono">
                    {result.total_obtained}
                  </td>
                  <td className="py-3 px-4 text-center border border-stone-300 text-xs text-stone-500">
                    {isUrdu ? 'حتمی' : 'Verified'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Performance Summary Cards (Percentage, Position, Remarks) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-stone-200">
            {/* Overall Percentage */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
              <div className="text-xs font-bold uppercase text-red-700 tracking-wider">{t('overallPercentage')}</div>
              <div className="text-3xl font-black text-red-800 mt-1 font-mono">
                {result.overall_percentage}%
              </div>
              <div className="text-[11px] text-red-600 mt-0.5">{isUrdu ? 'کل حاصل کردہ / کل نمبر × ۱۰۰' : 'Total Obtained / Total × 100'}</div>
            </div>

            {/* Paper Percentage */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center">
              <div className="text-xs font-bold uppercase text-stone-600 tracking-wider">{t('paperPercentage')}</div>
              <div className="text-3xl font-black text-stone-800 mt-1 font-mono">
                {result.paper_percentage !== null && result.paper_percentage !== undefined
                  ? `${result.paper_percentage}%`
                  : 'N/A'}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">{isUrdu ? 'تحریری امتحانی وزن' : 'Written Paper Weightage'}</div>
            </div>

            {/* Class Position */}
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
              <div className="text-xs font-bold uppercase text-yellow-800 tracking-wider">{t('classStanding')}</div>
              <div className="text-2xl font-black text-yellow-900 mt-1.5">
                {result.position || '—'}
              </div>
              <div className="text-[11px] text-yellow-700 mt-0.5">{isUrdu ? 'کلاس میں پوزیشن' : 'Official Standing'}</div>
            </div>

            {/* Remarks */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left sm:text-center">
              <div className="text-xs font-bold uppercase text-stone-600 tracking-wider">{t('remarks')}</div>
              <div className="text-sm font-semibold text-stone-800 mt-1.5 italic">
                “{result.remarks || 'Satisfactory academic performance'}”
              </div>
            </div>
          </div>

          {/* Official Grading Scale Reference Table for Print */}
          <div className="mt-6 pt-4 border-t border-stone-200 text-[11px] text-stone-500 flex flex-wrap justify-between items-center gap-2">
            <span className="font-semibold text-stone-700">{isUrdu ? 'گریڈنگ پیمانہ:' : 'Grading Scale:'}</span>
            <span>A+ (80% & Above)</span>
            <span>•</span>
            <span>A (70% - 79%)</span>
            <span>•</span>
            <span>B (60% - 69%)</span>
            <span>•</span>
            <span>C (50% - 59%)</span>
            <span>•</span>
            <span>D (40% - 49%)</span>
            <span>•</span>
            <span className="text-red-600 font-bold">F (Below 40% - Fail)</span>
          </div>

          {/* Official Signatures & Seal */}
          <div className="mt-12 pt-8 border-t-2 border-stone-300 grid grid-cols-3 gap-6 text-center text-xs text-stone-600">
            <div>
              <div className="h-12 flex items-end justify-center font-serif-brand font-bold text-stone-800 text-sm italic">
                Exam Section
              </div>
              <div className="pt-2 border-t border-stone-400 font-semibold">
                {isUrdu ? 'کنٹرولر امتحانات' : 'Controller of Examinations'}
              </div>
            </div>

            <div>
              <div className="h-12 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-red-700 flex items-center justify-center text-[9px] uppercase font-bold text-red-800 text-center leading-tight p-1 shadow-sm">
                  HRK Seal<br />Peshawar
                </div>
              </div>
              <div className="pt-2 border-t border-stone-400 font-semibold">
                {isUrdu ? 'اسکول کی سرکاری مہر' : 'Institutional Seal'}
              </div>
            </div>

            <div>
              <div className="h-12 flex items-end justify-center font-serif-brand font-bold text-stone-800 text-sm italic">
                Hassan Rooz
              </div>
              <div className="pt-2 border-t border-stone-400 font-semibold">
                {isUrdu ? 'پرنسپل حسن روز' : 'Principal Hassan Rooz'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
