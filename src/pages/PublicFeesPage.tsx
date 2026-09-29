import React, { useState } from 'react';
import { Crest } from '../components/Crest';
import { FeeRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  CreditCard,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Receipt,
  FileCheck,
  Building,
  HelpCircle,
} from 'lucide-react';

interface FeeLookupResponse {
  student: {
    name: string;
    rollNumber: string;
    class: string;
  };
  summary: {
    totalAssessed: number;
    totalPaid: number;
    outstandingBalance: number;
    recordsCount: number;
    paidMonths: number;
    unpaidMonths: number;
  };
  records: FeeRecord[];
}

export const PublicFeesPage: React.FC = () => {
  const { t, isUrdu } = useLanguage();

  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('10th');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feeData, setFeeData] = useState<FeeLookupResponse | null>(null);

  // Print format state: 'statement' | 'challan'
  const [printFormat, setPrintFormat] = useState<'statement' | 'challan'>('statement');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeeData(null);

    if (!studentName.trim() || !rollNumber.trim() || !studentClass.trim()) {
      setError(isUrdu ? 'برائے مہربانی طالب علم کا نام، رول نمبر اور کلاس درج کریں۔' : 'Please provide Student Name, Roll Number, and Class.');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        studentName: studentName.trim(),
        rollNumber: rollNumber.trim(),
        class: studentClass.trim(),
      });

      const res = await fetch(`/api/public/fees?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || (isUrdu ? 'اس طالب علم کے لیے کوئی فیس ریکارڈ نہیں ملا۔' : 'No fee records found for the specified student details.'));
      } else {
        setFeeData(json.data);
      }
    } catch (err) {
      console.error('Error fetching fees:', err);
      setError(isUrdu ? 'سرور سے رابطہ نہیں ہو سکا۔ برائے مہربانی دوبارہ کوشش کریں۔' : 'Unable to retrieve fee records. Please check your internet or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (format: 'statement' | 'challan') => {
    setPrintFormat(format);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleLoadDemo = (sName: string, rNum: string, sClass: string) => {
    setStudentName(sName);
    setRollNumber(rNum);
    setStudentClass(sClass);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2 no-print">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <CreditCard className="w-4 h-4 text-blue-700" />
          <span>{isUrdu ? 'اکاؤنٹس آفس و فیس ریکارڈ' : 'Accounts & Tuition Ledger'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif-brand">
          {t('feesTitle')}
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          {t('feesSub')}
        </p>
      </div>

      {/* Search Form Card */}
      <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-6 sm:p-8 no-print">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                {t('studentName')} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={isUrdu ? 'طالب علم کا نام' : 'e.g. Muhammad Ali'}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm font-medium text-stone-900 outline-none transition"
              />
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm font-medium text-stone-900 outline-none transition font-mono"
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm font-medium text-stone-900 outline-none transition bg-white"
              >
                <option value="10th">{isUrdu ? 'دسویں کلاس (میٹرک)' : 'Class 10th'}</option>
                <option value="9th">{isUrdu ? 'نویں کلاس (نہم)' : 'Class 9th'}</option>
                <option value="8th">{isUrdu ? 'آٹھویں کلاس' : 'Class 8th'}</option>
                <option value="7th">{isUrdu ? 'ساتویں کلاس' : 'Class 7th'}</option>
                <option value="6th">{isUrdu ? 'چھٹی کلاس' : 'Class 6th'}</option>
                <option value="5th">{isUrdu ? 'پانچویں کلاس' : 'Class 5th'}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-stone-100">
            {/* Quick Demo Pre-fill Links */}
            <div className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-stone-700">{isUrdu ? 'فوری ٹیسٹ:' : 'Quick Test:'}</span>
              <button
                type="button"
                onClick={() => handleLoadDemo('Muhammad Ali', '101', '10th')}
                className="text-blue-700 hover:underline font-medium cursor-pointer"
              >
                Ali (101)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleLoadDemo('Ayesha Khan', '102', '10th')}
                className="text-blue-700 hover:underline font-medium cursor-pointer"
              >
                Ayesha (102)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleLoadDemo('Hamza Rooz', '103', '10th')}
                className="text-blue-700 hover:underline font-medium cursor-pointer"
              >
                Hamza (103)
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-stone-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isUrdu ? 'کھاتہ تلاش ہو رہا ہے...' : 'Searching Ledger...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-yellow-300" />
                  <span>{t('searchFeesBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">{isUrdu ? 'فیس ریکارڈ نوٹس' : 'Fee Record Notice'}</div>
              <div>{error}</div>
              <div className="text-xs text-red-600 pt-1">
                {isUrdu
                  ? 'اگر فیس بینک یا کیش کاؤنٹر پر جمع کروائی ہے تو ریکارڈ اپ ڈیٹ ہونے میں ۲۴ گھنٹے لگ سکتے ہیں۔'
                  : 'If fee was recently paid at bank or cash counter, records may take 24 hours to be processed by accounts staff.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fee Breakdown Display */}
      {feeData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Statement View */}
          <div className={`bg-white rounded-2xl shadow-xl border-2 border-stone-300 p-6 sm:p-10 printable-card space-y-8 ${printFormat === 'challan' ? 'no-print' : ''}`}>
            {/* Header Action Buttons */}
            <div className="flex flex-wrap justify-between items-center pb-6 border-b-2 border-stone-200 gap-3 no-print">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {isUrdu
                    ? `ریکارڈ دستیاب ہے: ${feeData.records.length} ماہانہ اندراجات`
                    : `Student Account Found: ${feeData.records.length} Monthly Entries`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint('statement')}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-yellow-400 font-bold text-xs shadow flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('printStatement')}</span>
                </button>
                <button
                  onClick={() => handlePrint('challan')}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{t('printVoucher3Copy')}</span>
                </button>
              </div>
            </div>

            {/* School Header */}
            <div className="text-center pb-4 border-b-2 border-stone-200 space-y-1">
              <div className="flex justify-center mb-2">
                <Crest size="lg" />
              </div>
              <div className="text-xs tracking-widest uppercase font-bold text-stone-600">
                {isUrdu ? 'مین روڈ، نزد رس شادی ہال، پشاور کینٹ، خیبر پختونخوا' : 'Main Road, Near to Ras Shadi Hall, Peshawar Cantt, Pakistan'}
              </div>
              <div className="text-sm font-semibold text-red-800">
                Accounts Helpline: 0300-0598873 • 0300-5442333 • Principal: Hassan Rooz
              </div>
              <div className="inline-block mt-2 px-5 py-1 rounded-lg bg-stone-900 text-white font-serif-brand font-bold text-sm uppercase tracking-wider">
                {isUrdu ? 'ماہانہ فیس کی سرکاری تصدیقی مارک شیٹ / کھاتہ' : 'Official Monthly Tuition Fee Statement'}
              </div>
            </div>

            {/* Student Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm">
              <div>
                <span className="text-xs uppercase text-stone-500 block font-semibold">{t('studentName')}:</span>
                <strong className="text-stone-900 text-base">{feeData.student.name}</strong>
              </div>
              <div>
                <span className="text-xs uppercase text-stone-500 block font-semibold">{t('classLabel')}:</span>
                <strong className="text-blue-700 text-base">{feeData.student.class}</strong>
              </div>
              <div>
                <span className="text-xs uppercase text-stone-500 block font-semibold">{t('rollNumber')}:</span>
                <strong className="text-blue-700 text-base font-mono">{feeData.student.rollNumber}</strong>
              </div>
            </div>

            {/* Aggregate Summary Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center">
                <div className="text-xs uppercase font-bold text-stone-500">{t('totalAssessed')}</div>
                <div className="text-2xl font-black text-stone-900 mt-1 font-mono">
                  Rs. {feeData.summary.totalAssessed.toLocaleString()}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">{feeData.summary.recordsCount} {isUrdu ? 'ماہانہ بلنگز' : 'Monthly Cycles'}</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-xs uppercase font-bold text-emerald-700">{t('totalPaid')}</div>
                <div className="text-2xl font-black text-emerald-800 mt-1 font-mono">
                  Rs. {feeData.summary.totalPaid.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-700 mt-0.5">{feeData.summary.paidMonths} {isUrdu ? 'ماہ کلئیر' : 'Months Cleared'}</div>
              </div>

              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                <div className="text-xs uppercase font-bold text-red-700">{t('outstandingBalance')}</div>
                <div className="text-2xl font-black text-red-800 mt-1 font-mono">
                  Rs. {feeData.summary.outstandingBalance.toLocaleString()}
                </div>
                <div className="text-xs text-red-600 mt-0.5 font-semibold">
                  {feeData.summary.outstandingBalance === 0
                    ? (isUrdu ? 'کوئی بقایا نہیں (کلیئر)' : 'No Dues Pending')
                    : (isUrdu ? 'برائے مہربانی بقایا جمع کروائیں' : 'Please Pay at Counter')}
                </div>
              </div>
            </div>

            {/* Month-by-Month Table */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-700" />
                  {t('monthlyBreakdown')}
                </h3>
                <span className="text-xs text-stone-500 font-mono">Currency: PKR (Rs.)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse border border-stone-300">
                  <thead>
                    <tr className="bg-stone-900 text-white text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 border border-stone-800">{t('monthCol')}</th>
                      <th className="py-3 px-4 border border-stone-800 text-right">{t('monthlyFeeCol')}</th>
                      <th className="py-3 px-4 border border-stone-800 text-center">{t('statusCol')}</th>
                      <th className="py-3 px-4 border border-stone-800 text-right">{t('balanceCol')}</th>
                      <th className="py-3 px-4 border border-stone-800">{t('receivedByCol')}</th>
                      <th className="py-3 px-4 border border-stone-800">{isUrdu ? 'تاریخ / نوٹس' : 'Payment Date / Note'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {feeData.records.map((r, idx) => {
                      const isPaid = r.status === 'Paid';
                      const isPartial = r.status === 'Partially Paid';
                      const isUnpaid = r.status === 'Unpaid';

                      return (
                        <tr key={r.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                          <td className="py-3 px-4 border border-stone-300 font-bold text-stone-900">
                            {r.month}
                          </td>
                          <td className="py-3 px-4 border border-stone-300 text-right font-semibold text-stone-800 font-mono">
                            Rs. {Number(r.monthly_fee).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 border border-stone-300 text-center">
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
                              {r.status}
                            </span>
                          </td>
                          <td
                            className={`py-3 px-4 border border-stone-300 text-right font-black font-mono ${
                              r.balance > 0 ? 'text-red-700' : 'text-emerald-700'
                            }`}
                          >
                            Rs. {Number(r.balance).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 border border-stone-300 text-stone-700 font-medium text-xs sm:text-sm">
                            {r.received_by || '—'}
                          </td>
                          <td className="py-3 px-4 border border-stone-300 text-xs text-stone-500">
                            {r.payment_date && <div>Date: {r.payment_date}</div>}
                            {r.notes && <div className="italic text-stone-600">{r.notes}</div>}
                            {!r.payment_date && !r.notes && '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Stamp & Cashier Signatures */}
            <div className="mt-8 pt-6 border-t-2 border-stone-300 grid grid-cols-2 gap-8 text-center text-xs text-stone-600">
              <div>
                <div className="h-10 flex items-end justify-center font-bold text-stone-800">
                  Accounts Department
                </div>
                <div className="pt-2 border-t border-stone-400 font-semibold">
                  {isUrdu ? 'اکاؤنٹنٹ / کیشئر کے دستخط' : 'Cashier / Accountant Signature'}
                </div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center font-bold text-stone-800">
                  Hassan Rooz
                </div>
                <div className="pt-2 border-t border-stone-400 font-semibold">
                  {isUrdu ? 'پرنسپل کے دستخط و مہر' : 'Principal Verification Stamp'}
                </div>
              </div>
            </div>
          </div>

          {/* 3-Copy Bank Challan (Visible when printing 3-copy challan) */}
          <div className={`${printFormat === 'challan' ? 'block' : 'hidden print:hidden'} bg-white rounded-2xl border-2 border-blue-900 p-4 space-y-4`}>
            <div className="text-center font-bold text-sm text-stone-700 pb-2 border-b border-stone-300 no-print">
              Preview of Standard 3-Copy Fee Challan (Bank Copy / School Copy / Student Copy)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {['BANK COPY', 'SCHOOL ACCOUNTS COPY', 'STUDENT / PARENT COPY'].map((copyType, idx) => (
                <div key={idx} className="challan-copy p-4 rounded-xl border border-stone-400 bg-white space-y-3">
                  <div className="text-center border-b border-stone-300 pb-2 space-y-1">
                    <span className="font-mono text-[10px] font-bold uppercase bg-stone-900 text-white px-2 py-0.5 rounded">
                      {copyType}
                    </span>
                    <div className="font-serif-brand font-bold text-sm text-red-900">
                      HRK EDUCATION SYSTEM
                    </div>
                    <div className="text-[10px] text-stone-600">Peshawar Cantt</div>
                    <div className="text-[9px] text-stone-500">Challan #: HRK-{feeData.student.rollNumber}-{idx + 1}01</div>
                  </div>

                  <div className="space-y-1 text-[11px] bg-stone-50 p-2 rounded border border-stone-200">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Student:</span>
                      <strong className="text-stone-900">{feeData.student.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Class / Roll:</span>
                      <strong className="text-blue-900">{feeData.student.class} / {feeData.student.rollNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Fee Cycle:</span>
                      <span className="font-semibold text-stone-800">{feeData.records[0]?.month || 'Current Session'}</span>
                    </div>
                  </div>

                  <div className="border border-stone-300 rounded overflow-hidden">
                    <table className="w-full text-[10px] text-left">
                      <thead className="bg-stone-200 text-stone-800">
                        <tr>
                          <th className="p-1">Description</th>
                          <th className="p-1 text-right">Amount (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        <tr>
                          <td className="p-1 font-medium">Monthly Tuition Fee</td>
                          <td className="p-1 text-right font-mono">Rs. {Number(feeData.records[0]?.monthly_fee || 5000).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-medium">Exam / Lab Charges</td>
                          <td className="p-1 text-right font-mono">Rs. 0</td>
                        </tr>
                        <tr className="bg-stone-100 font-bold">
                          <td className="p-1">Total Payable:</td>
                          <td className="p-1 text-right font-mono text-red-800">
                            Rs. {Number(feeData.summary.outstandingBalance || feeData.records[0]?.monthly_fee || 5000).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-[9px] text-stone-500 space-y-0.5 pt-1">
                    <div>• Due Date: 10th of every calendar month</div>
                    <div>• Payable at any designated Bank branch / Cash Counter</div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-dashed border-stone-400 flex justify-between text-[9px] text-stone-600">
                    <span>Cashier Signature</span>
                    <span>Bank Stamp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
