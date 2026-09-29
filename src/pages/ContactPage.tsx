import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  User,
  MessageSquare,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, isUrdu } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setSubmitted(true);
    setName('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
          <Phone className="w-4 h-4 text-red-700" />
          <span>{isUrdu ? 'انتظامیہ سے رابطہ فرمائیں' : 'Get in Touch With Administration'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif-brand">
          {t('contactTitle')}
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          {isUrdu
            ? 'داخلہ معلومات، نتائج کی تصدیق اور والدین کی ملاقات کیلئے ہمارے پشاور کینٹ کیمپس میں تشریف لائیں۔'
            : 'We welcome parent inquiries, admission consultations, and result verification visits at our Peshawar Cantt campus.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Official Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-stone-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-yellow-400 font-bold mb-1">
                {isUrdu ? 'مرکزی کیمپس' : 'Main Campus'}
              </div>
              <h2 className="text-xl font-bold font-serif-brand text-white">
                HRK Education System
              </h2>
              <p className="text-xs text-stone-400">{isUrdu ? 'پشاور کینٹ، پاکستان' : 'Peshawar Cantt, Pakistan'}</p>
            </div>

            <div className="space-y-5 text-sm">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-800/80 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    {isUrdu ? 'مقام و پتہ' : 'Address & Location'}
                  </div>
                  <p className="font-semibold text-white leading-snug mt-0.5">
                    {t('schoolLocation')}
                  </p>
                </div>
              </div>

              {/* Principal */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5 border border-stone-700">
                  <User className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    {t('principalTitle')}
                  </div>
                  <p className="font-bold text-white text-base mt-0.5">
                    {t('principalName')}
                  </p>
                </div>
              </div>

              {/* Telephone - Clickable on mobile */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/60 text-white flex items-center justify-center shrink-0 mt-0.5 border border-emerald-700/50">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    {t('directHelplines')}
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    <a
                      href="tel:03000598873"
                      className="text-base font-bold text-yellow-400 hover:text-yellow-300 hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>0300-0598873</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        ({isUrdu ? 'پرنسپل آفس' : 'Principal / Head Office'})
                      </span>
                    </a>
                    <a
                      href="tel:03005442333"
                      className="text-base font-bold text-yellow-400 hover:text-yellow-300 hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>0300-5442333</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        ({isUrdu ? 'اکاؤنٹس و داخلہ ڈیسک' : 'Accounts & Admission'})
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5 border border-stone-700">
                  <Clock className="w-5 h-5 text-stone-300" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    {t('officeHours')}
                  </div>
                  <p className="text-stone-300 text-xs mt-0.5">
                    {t('officeTimingsVal')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Online Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-700" />
              {t('inquiryFormTitle')}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {isUrdu
                ? 'اپنا پیغام درج کریں، ہماری انتظامیہ جلد آپ کے نمبر پر رابطہ کرے گی۔'
                : 'Fill out this message form and our administrative staff will respond to your contact number.'}
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold">
                {isUrdu ? 'پیغام کامیابی سے موصول ہو گیا' : 'Inquiry Successfully Submitted'}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                {isUrdu
                  ? 'ایچ آر کے ایجوکیشن سسٹم سے رابطہ کرنے کا شکریہ۔ آپ کی درخواست ایڈمن آفس کو پہنچ چکی ہے۔'
                  : 'Thank you for contacting HRK Education System. Your message has been received by the administrative office. We will call you back shortly.'}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition cursor-pointer"
              >
                {isUrdu ? 'ایک اور پیغام بھیجیں' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    {isUrdu ? 'آپ کا نام' : 'Your Name'} <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isUrdu ? 'والد یا طالب علم کا نام' : 'Parent or Student Name'}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm text-stone-900 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    {isUrdu ? 'رابطہ فون نمبر' : 'Contact Phone Number'} <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300-1234567"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm text-stone-900 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  {isUrdu ? 'موضوع یا کلاس' : 'Inquiry Topic / Class'}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً کلاس نہم داخلہ یا فیس معلومات' : 'e.g. Class 9th Admission or Fee Verification'}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm text-stone-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  {isUrdu ? 'تفصیلی پیغام' : 'Detailed Message'} <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder={isUrdu ? 'اپنا سوال یا ضروری پیغام یہاں درج فرمائیں...' : 'Write your questions or notes for the administration...'}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-sm text-stone-900 outline-none transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-yellow-300" />
                <span>{t('submitInquiry')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
