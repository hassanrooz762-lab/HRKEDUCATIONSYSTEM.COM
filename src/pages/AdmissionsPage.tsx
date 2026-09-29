import React, { useState } from 'react';
import { Crest } from '../components/Crest';
import { AdmissionApplication } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  GraduationCap,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Award,
  Sparkles,
  DollarSign,
  Download,
} from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const { isUrdu, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'form' | 'status' | 'criteria' | 'fees'>('form');

  // Form State
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherCnic, setFatherCnic] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('');
  const [appliedClass, setAppliedClass] = useState('9th');
  const [previousSchool, setPreviousSchool] = useState('');
  const [previousMarks, setPreviousMarks] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Status Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchingStatus, setSearchingStatus] = useState(false);
  const [statusResults, setStatusResults] = useState<AdmissionApplication[] | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const availableClasses = [
    'Playgroup',
    'Nursery',
    'Prep',
    'Class 1st',
    'Class 2nd',
    'Class 3rd',
    'Class 4th',
    'Class 5th',
    'Class 6th',
    'Class 7th',
    'Class 8th',
    '9th (Science)',
    '9th (Arts)',
    '10th (Science)',
    '10th (Arts)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmissionSuccess(null);

    if (!studentName.trim() || !fatherName.trim() || !phone.trim() || !address.trim()) {
      setSubmitError(isUrdu ? 'براہِ کرم تمام لازمی فیلڈز پر کریں۔' : 'Please fill all required fields: Student Name, Father Name, Phone, and Address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/public/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName.trim(),
          father_name: fatherName.trim(),
          father_cnic: fatherCnic.trim(),
          gender,
          dob,
          applied_class: appliedClass,
          previous_school: previousSchool.trim(),
          previous_marks: previousMarks.trim(),
          phone: phone.trim(),
          address: address.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setSubmitError(json.error || 'Failed to submit admission application.');
      } else {
        setSubmissionSuccess(json);
        // Reset form
        setStudentName('');
        setFatherName('');
        setFatherCnic('');
        setDob('');
        setPreviousSchool('');
        setPreviousMarks('');
        setPhone('');
        setAddress('');
      }
    } catch (err) {
      console.error('Admission submit error:', err);
      setSubmitError('Unable to contact admissions server. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError(null);
    setStatusResults(null);

    const q = searchQuery.trim();
    if (!q) {
      setStatusError(isUrdu ? 'براہِ کرم ایپلیکیشن نمبر یا موبائل فون نمبر درج کریں۔' : 'Please provide Application Number or Phone Number.');
      return;
    }

    setSearchingStatus(true);
    try {
      const res = await fetch(`/api/public/admissions/status?q=${encodeURIComponent(q)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatusError(json.error || 'No matching admission applications found.');
      } else {
        setStatusResults(json.data);
      }
    } catch (err) {
      console.error('Admission status error:', err);
      setStatusError('Unable to search admission records. Please try again.');
    } finally {
      setSearchingStatus(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner - Rich Institutional Red */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-red-700/60 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>{isUrdu ? 'داخلے جاری ہیں • تعلیمی سال 2025–2026' : 'Admissions Open • Academic Session 2025–2026'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif-brand">
                {isUrdu ? 'آن لائن داخلہ فارم و رہنمائی' : 'Online Admissions & Enrollment'}
              </h1>
              <p className="text-red-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                {isUrdu
                  ? 'ایچ آر کے ایجوکیشن سسٹم پشاور کینٹ میں پلے گروپ تا دسویں جماعت (میٹرک سائنس و آرٹس) کے لیے آن لائن داخلہ فارم جمع کروائیں یا اپنی جمع شدہ درخواست کا جائزہ لیں۔'
                  : 'Enroll your child in Peshawar Cantt’s prestigious academic institution under the mentorship of Principal Hassan Rooz. BISE Peshawar affiliated.'}
              </p>
            </div>
            <div className="shrink-0 flex justify-center">
              <Crest size="xl" variant="full" />
            </div>
          </div>

          {/* Quick Helplines Callout Inside Banner */}
          <div className="mt-8 pt-6 border-t border-red-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-yellow-300 font-bold">
              <Phone className="w-4 h-4" />
              <span>{isUrdu ? 'داخلہ ہیلپ لائن:' : 'Admissions Helpline:'}</span>
              <a href="tel:03000598873" className="hover:underline font-mono text-sm text-white">0300-0598873</a>
              <span className="text-red-400">/</span>
              <a href="tel:03005442333" className="hover:underline font-mono text-sm text-white">0300-5442333</a>
            </div>
            <div className="flex items-center gap-2 text-red-200">
              <MapPin className="w-4 h-4 text-yellow-400" />
              <span>Main Road, Near to Ras Shadi Hall, Peshawar Cantt</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Admissions */}
        <div className="bg-white rounded-2xl p-2 shadow-md border-2 border-red-200 flex flex-wrap gap-2 justify-center sm:justify-start no-print">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'form'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-stone-700 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{isUrdu ? '۱۔ آن لائن داخلہ فارم' : '1. Apply Online Form'}</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'status'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-stone-700 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{isUrdu ? '۲۔ درخواست کا اسٹیٹس' : '2. Track Status'}</span>
          </button>

          <button
            onClick={() => setActiveTab('criteria')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'criteria'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-stone-700 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isUrdu ? '۳۔ ضروری کاغذات و اہلیت' : '3. Criteria & Documents'}</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'fees'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-stone-700 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{isUrdu ? '۴۔ فیس اسٹرکچر' : '4. Fee Structure'}</span>
          </button>
        </div>

        {/* TAB 1: ONLINE ADMISSION FORM */}
        {activeTab === 'form' && (
          <div className="space-y-6">
            {/* Success Card with Printable Slip */}
            {submissionSuccess && (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
                      {isUrdu ? 'درخواست کامیابی سے موصول ہوئی' : 'Application Received Successfully'}
                    </span>
                    <h2 className="text-2xl font-black text-stone-900 font-serif-brand">
                      {isUrdu ? 'داخلہ درخواست کامیابی کے ساتھ جمع ہو گئی ہے' : 'Online Admission Application Submitted!'}
                    </h2>
                    <p className="text-stone-600 text-sm">
                      {isUrdu
                        ? 'آپ کی درخواست ایچ آر کے ایجوکیشن سسٹم ایڈمشن سیل کو موصول ہو گئی ہے۔ براہِ کرم اپنا ایپلیکیشن نمبر نوٹ فرما لیں۔'
                        : 'Your online application has been securely recorded. Please keep your Application Number safe for interview and verification.'}
                    </p>
                  </div>
                </div>

                {/* Printable Slip Container */}
                <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-stone-200 gap-2">
                    <div>
                      <span className="text-xs text-stone-500 block uppercase font-bold">Official Application Reference</span>
                      <span className="text-2xl font-mono font-black text-red-700">{submissionSuccess.applicationNo}</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                        Status: Pending Review & Interview
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-stone-500 block">Candidate Name:</span>
                      <strong className="text-stone-900">{submissionSuccess.data?.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Father Name:</span>
                      <strong className="text-stone-900">{submissionSuccess.data?.fatherName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Applied Class:</span>
                      <strong className="text-red-700 font-bold">{submissionSuccess.data?.appliedClass}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Contact Phone:</span>
                      <strong className="text-stone-900 font-mono">{submissionSuccess.data?.phone}</strong>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex flex-wrap justify-between items-center gap-3">
                    <p className="text-xs text-stone-500">
                      * Please visit the campus office along with 2 passport photographs and B-form copy within 3 working days.
                    </p>
                    <button
                      onClick={handlePrintSlip}
                      className="py-2.5 px-5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow transition flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{isUrdu ? 'داخلہ سلپ پرنٹ کریں' : 'Print Admission Slip'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Application Form */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-red-200 overflow-hidden">
              <div className="bg-red-800 text-white p-6 sm:p-8 border-b-4 border-yellow-500 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-brand">
                    {isUrdu ? 'طلباء داخلہ رجسٹریشن فارم (2025–2026)' : 'Student Admission Application Form (2025–2026)'}
                  </h2>
                  <p className="text-red-200 text-xs sm:text-sm mt-1">
                    {isUrdu ? 'براہِ کرم تمام فیلڈز درست اور مکمل معلومات کے ساتھ پر کریں۔' : 'Please provide accurate candidate and parent information for verification.'}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-600 text-xs font-bold text-yellow-300">
                  Principal Hassan Rooz Office
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Section 1: Candidate Basic Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-red-900 border-b border-red-100 pb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    <span>{isUrdu ? '۱۔ طالب علم کی بنیادی معلومات' : '1. Candidate Information'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Student Name */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'طالب علم کا نام' : 'Student Full Name'} <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Muhammad Hamza"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium outline-none transition"
                      />
                    </div>

                    {/* Father Name */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'والد کا نام' : 'Father / Guardian Name'} <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="e.g. Tariq Mahmood"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium outline-none transition"
                      />
                    </div>

                    {/* Father CNIC */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'والد کا شناختی کارڈ نمبر' : 'Father CNIC (Without dashes)'}
                      </label>
                      <input
                        type="text"
                        value={fatherCnic}
                        onChange={(e) => setFatherCnic(e.target.value)}
                        placeholder="e.g. 17301-1234567-1"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium outline-none transition"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'جنس' : 'Gender'} <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium outline-none transition bg-white"
                      >
                        <option value="Male">{isUrdu ? 'مرد / لڑکا (Boy)' : 'Male / Boy'}</option>
                        <option value="Female">{isUrdu ? 'عورت / لڑکی (Girl)' : 'Female / Girl'}</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'تاریخ پیدائش' : 'Date of Birth'}
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-medium outline-none transition"
                      />
                    </div>

                    {/* Applying Class */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'مطلوبہ کلاس برائے داخلہ' : 'Class Applying For'} <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={appliedClass}
                        onChange={(e) => setAppliedClass(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-red-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm font-bold text-red-900 outline-none transition bg-red-50/50"
                      >
                        {availableClasses.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Previous School Academic Record */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-red-900 border-b border-red-100 pb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span>{isUrdu ? '۲۔ سابقہ تعلیمی ریکارڈ' : '2. Previous Academic History'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'سابقہ اسکول کا نام' : 'Previous School Name'}
                      </label>
                      <input
                        type="text"
                        value={previousSchool}
                        onChange={(e) => setPreviousSchool(e.target.value)}
                        placeholder="e.g. Army Public School or Cantt Board School"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 text-sm outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'حاصل کردہ گریڈ یا نمبر' : 'Previous Marks / Grade Obtained'}
                      </label>
                      <input
                        type="text"
                        value={previousMarks}
                        onChange={(e) => setPreviousMarks(e.target.value)}
                        placeholder="e.g. 485/550 or A+ Grade"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 text-sm outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Contact & Residential Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-red-900 border-b border-red-100 pb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>{isUrdu ? '۳۔ رابطہ و رہائشی پتہ' : '3. Contact & Address'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'موبائل نمبر / واٹس ایپ' : 'Contact Phone / WhatsApp'} <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 text-sm font-mono outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'مکمل رہائشی پتہ' : 'Full Home Address in Peshawar'} <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. House # 12, Street 3, Saddar, Peshawar Cantt"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 text-sm outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
                  <div className="text-xs text-stone-500">
                    <span className="font-bold text-red-700">* Required fields.</span> Your submission creates a permanent application record in the HRK database.
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-700 hover:bg-red-800 disabled:bg-stone-400 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-yellow-300" />
                        <span>{isUrdu ? 'داخلہ درخواست جمع کروائیں' : 'Submit Admission Application'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: TRACK STATUS */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-red-200 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-brand">
                  {isUrdu ? 'درخواست کا اسٹیٹس معلوم کریں' : 'Track Admission Application Status'}
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-1">
                  {isUrdu
                    ? 'اپنا ایپلیکیشن نمبر (مثلاً HRK-ADM-2026-XXXX) یا اپنا رابطہ نمبر درج کر کے انٹرویو و داخلہ اسٹیٹس چیک کریں۔'
                    : 'Search by your unique Application Reference Number or registered Phone Number.'}
                </p>
              </div>

              <form onSubmit={handleSearchStatus} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Application No. or Phone (e.g. 0300...)"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-red-600 text-sm font-medium outline-none transition"
                />
                <button
                  type="submit"
                  disabled={searchingStatus}
                  className="px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {searchingStatus ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>{isUrdu ? 'اسٹیٹس چیک کریں' : 'Check Status'}</span>
                </button>
              </form>

              {statusError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{statusError}</span>
                </div>
              )}

              {/* Status Results Display */}
              {statusResults && statusResults.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                    {isUrdu ? 'درخواستوں کے نتائج' : 'Found Application Records'}
                  </h3>

                  {statusResults.map((app) => (
                    <div
                      key={app.id}
                      className="bg-stone-50 border-2 border-stone-200 hover:border-red-600 rounded-2xl p-5 shadow-sm space-y-4 transition"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-stone-200">
                        <div>
                          <span className="text-xs text-stone-500 block">Application Reference:</span>
                          <span className="text-lg font-mono font-bold text-red-700">{app.application_no}</span>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : app.status === 'Interview Scheduled'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : app.status === 'Rejected'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            }`}
                          >
                            Status: {app.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-stone-500 block">Candidate:</span>
                          <strong>{app.student_name}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Father:</span>
                          <strong>{app.father_name}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Class:</span>
                          <strong className="text-red-700">{app.applied_class}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Submitted:</span>
                          <span>{app.submitted_at?.split('T')[0]}</span>
                        </div>
                      </div>

                      {app.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-900">
                          <strong>Admissions Office Remarks:</strong> {app.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CRITERIA & REQUIRED DOCUMENTS */}
        {activeTab === 'criteria' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-red-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-yellow-300" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-serif-brand">
                  {isUrdu ? 'ضروری دستاویزات' : 'Required Documents'}
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-stone-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Attested photocopy of NADRA Birth Certificate or Form-B.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Photocopy of Father's or Guardian's Computerized National Identity Card (CNIC).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>4 recent passport-size photographs with sky-blue background.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Original School Leaving Certificate (SLC) / Transfer Certificate from previous institution.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Previous academic marksheet or progress report card.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-red-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-yellow-300" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-serif-brand">
                  {isUrdu ? 'داخلہ معیار و طریقہ کار' : 'Admission Procedure & Test'}
                </h3>
              </div>
              <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
                <p>
                  <strong>1. Age Criteria:</strong> Playgroup (3.0+ years), Nursery (4.0+ years), Prep (5.0+ years), Class 1st (6.0+ years).
                </p>
                <p>
                  <strong>2. Entry Assessment:</strong> Candidates for Class 1st to 9th will undergo an informal diagnostic assessment in English, Mathematics, and Urdu to evaluate baseline proficiency.
                </p>
                <p>
                  <strong>3. Principal Interview:</strong> Parents and the applicant will meet Principal Hassan Rooz for final counseling and orientation.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900 font-semibold">
                  Note: Admissions are granted strictly on merit and seat availability as approved by BISE Peshawar guidelines.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEE STRUCTURE */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-red-200 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-brand">
                {isUrdu ? 'داخلہ و ماہانہ فیس شیڈول (2025–2026)' : 'Admission & Tuition Fee Schedule (2025–2026)'}
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Transparent and affordable fee structure with concession policies for siblings and deserving merit students.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-red-800 text-white text-xs uppercase tracking-wider font-bold">
                    <th className="p-3.5 rounded-l-xl">Class / Grade</th>
                    <th className="p-3.5">Registration / Prospectus</th>
                    <th className="p-3.5">Admission Fee (One-Time)</th>
                    <th className="p-3.5">Monthly Tuition Fee</th>
                    <th className="p-3.5 rounded-r-xl">Annual Lab / Exam Fund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
                  <tr className="hover:bg-red-50/50">
                    <td className="p-3.5 font-bold text-stone-900">Playgroup – Prep</td>
                    <td className="p-3.5 font-mono">Rs. 500</td>
                    <td className="p-3.5 font-mono font-bold text-red-700">Rs. 2,500</td>
                    <td className="p-3.5 font-mono font-bold">Rs. 2,000</td>
                    <td className="p-3.5 font-mono">Rs. 1,000</td>
                  </tr>
                  <tr className="hover:bg-red-50/50">
                    <td className="p-3.5 font-bold text-stone-900">Class 1st – 5th (Primary)</td>
                    <td className="p-3.5 font-mono">Rs. 500</td>
                    <td className="p-3.5 font-mono font-bold text-red-700">Rs. 3,000</td>
                    <td className="p-3.5 font-mono font-bold">Rs. 2,500</td>
                    <td className="p-3.5 font-mono">Rs. 1,200</td>
                  </tr>
                  <tr className="hover:bg-red-50/50">
                    <td className="p-3.5 font-bold text-stone-900">Class 6th – 8th (Middle)</td>
                    <td className="p-3.5 font-mono">Rs. 500</td>
                    <td className="p-3.5 font-mono font-bold text-red-700">Rs. 3,500</td>
                    <td className="p-3.5 font-mono font-bold">Rs. 2,800</td>
                    <td className="p-3.5 font-mono">Rs. 1,500</td>
                  </tr>
                  <tr className="hover:bg-red-50/50">
                    <td className="p-3.5 font-bold text-stone-900">Class 9th (Science / Arts)</td>
                    <td className="p-3.5 font-mono">Rs. 1,000</td>
                    <td className="p-3.5 font-mono font-bold text-red-700">Rs. 4,500</td>
                    <td className="p-3.5 font-mono font-bold">Rs. 3,200</td>
                    <td className="p-3.5 font-mono">Rs. 2,000</td>
                  </tr>
                  <tr className="hover:bg-red-50/50">
                    <td className="p-3.5 font-bold text-stone-900">Class 10th (Science / Arts)</td>
                    <td className="p-3.5 font-mono">Rs. 1,000</td>
                    <td className="p-3.5 font-mono font-bold text-red-700">Rs. 4,500</td>
                    <td className="p-3.5 font-mono font-bold">Rs. 3,500</td>
                    <td className="p-3.5 font-mono">Rs. 2,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 space-y-1">
              <p><strong>Sibling Concession:</strong> Real siblings enjoy 20% concession on monthly tuition fee for the 2nd child onwards.</p>
              <p><strong>Scholarships:</strong> Hafiz-e-Quran and BISE position holders are offered up to 50% tuition scholarship upon approval by Principal Hassan Rooz.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
