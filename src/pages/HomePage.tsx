import React, { useEffect, useState } from 'react';
import { Crest } from '../components/Crest';
import { NotificationItem, SchoolInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  CreditCard,
  Bell,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Calendar,
  Sparkles,
  Building2,
  UserPlus,
  Award,
  BookOpen,
  User,
  ExternalLink,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, isUrdu } = useLanguage();
  const [latestNotices, setLatestNotices] = useState<NotificationItem[]>([]);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [infoRes, noticeRes] = await Promise.all([
          fetch('/api/public/info'),
          fetch('/api/public/notifications'),
        ]);

        if (infoRes.ok) {
          const json = await infoRes.json();
          if (json.success) setSchoolInfo(json.data);
        }

        if (noticeRes.ok) {
          const json = await noticeRes.json();
          if (json.success) setLatestNotices(json.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16 bg-stone-50">
      {/* 1. Hero Section - Deep Institutional Red with Golden Accents */}
      <section className="relative bg-gradient-to-br from-red-950 via-red-900 to-red-850 text-white overflow-hidden py-16 lg:py-24 border-b-4 border-yellow-500 shadow-2xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs sm:text-sm font-bold uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>{isUrdu ? 'تعلیمی سال 2025–2026 میں داخلے جاری ہیں' : 'Admissions Open • Academic Session 2025–2026'}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-serif-brand leading-tight">
                HRK <span className="text-yellow-400">EDUCATION</span> SYSTEM
              </h1>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-red-200 text-base sm:text-lg font-semibold">
                <MapPin className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>Main Road, Near to Ras Shadi Hall, Peshawar Cantt</span>
              </div>

              <p className="text-red-100 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {isUrdu
                  ? 'ایچ آر کے ایجوکیشن سسٹم کے آفیشل پورٹل پر خوش آمدید۔ ہمارا مقصد طلباء کو معیاری جدید تعلیم، سائنسی و اخلاقی تربیت، اور والدین کو آن لائن داخلہ، رزلٹ و فیس کی شفاف سہولیات فراہم کرنا ہے۔'
                  : 'Welcome to the official portal of HRK Education System. We provide modern educational standards, scientific inquiry, moral values, and comprehensive student tracking for parents and students.'}
              </p>

              {/* Principal Leadership Card in Hero */}
              <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-red-950/80 border-2 border-red-700/80 max-w-lg shadow-lg backdrop-blur-sm text-left">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500 text-red-950 flex items-center justify-center font-black text-xl shadow-inner shrink-0">
                  <User className="w-7 h-7 text-red-950" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-yellow-400 font-bold">
                    {isUrdu ? 'پرنسپل و سرپرستِ اعلیٰ' : 'Principal & Head of Institution'}
                  </div>
                  <div className="text-base sm:text-lg font-black text-white font-serif-brand">
                    {isUrdu ? 'پرنسپل حسن روز (Principal Hassan Rooz)' : 'Principal Hassan Rooz'}
                  </div>
                  <div className="text-xs text-red-200 flex items-center gap-2 mt-0.5">
                    <span>Helpline: <strong>0300-0598873</strong></span>
                    <span>•</span>
                    <span>0300-5442333</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('admissions')}
                  className="px-6 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black text-sm sm:text-base shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer border-2 border-yellow-300"
                >
                  <UserPlus className="w-5 h-5 text-red-950" />
                  <span>{isUrdu ? 'آن لائن داخلہ فارم بھریں' : 'Apply For Admission (Online)'}</span>
                </button>

                <button
                  onClick={() => onNavigate('results')}
                  className="px-6 py-4 rounded-2xl bg-red-800 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-lg border border-red-600 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <FileText className="w-5 h-5 text-yellow-300" />
                  <span>{isUrdu ? 'امتحانی رزلٹ تلاش کریں' : 'Check Exam Result'}</span>
                </button>

                <button
                  onClick={() => onNavigate('fees')}
                  className="px-5 py-4 rounded-2xl bg-red-950 hover:bg-red-900 text-yellow-300 border border-red-700 font-bold text-sm shadow flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-yellow-400" />
                  <span>{isUrdu ? 'ماہانہ فیس کی تفصیلات' : 'Monthly Fee Status'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Crest Emblem & Quick Academic Stats */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-md bg-gradient-to-b from-red-950/95 to-red-900/90 rounded-3xl border-2 border-red-700 p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative">
                <div className="flex justify-center mb-4">
                  <Crest size="xl" variant="dark" showText={false} />
                </div>

                <div className="text-center space-y-1 mb-6">
                  <div className="text-xs uppercase tracking-widest text-yellow-400 font-bold">
                    {isUrdu ? 'سرکاری تعلیمی نشان' : 'Official Academic Seal'}
                  </div>
                  <div className="text-2xl font-black font-serif-brand text-white">HRK EDUCATION SYSTEM</div>
                  <div className="text-xs text-red-200">{isUrdu ? 'پشاور کینٹ، خیبر پختونخوا' : 'Peshawar Cantt, Khyber Pakhtunkhwa'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center border-t border-red-800 pt-4">
                  <div className="bg-red-950/80 p-3.5 rounded-2xl border border-red-800/80">
                    <div className="text-2xl font-black text-yellow-400 font-mono">100%</div>
                    <div className="text-xs text-red-200">{isUrdu ? 'بورڈ کامیابی شرح' : 'BISE Pass Rate'}</div>
                  </div>
                  <div className="bg-red-950/80 p-3.5 rounded-2xl border border-red-800/80">
                    <div className="text-2xl font-black text-white font-mono">Playgroup-10th</div>
                    <div className="text-xs text-red-200">{isUrdu ? 'سائنس و آرٹس کلاسز' : 'Science & Arts Wings'}</div>
                  </div>
                  <div className="bg-red-950/80 p-3.5 rounded-2xl border border-red-800/80">
                    <div className="text-xl font-black text-emerald-400">{isUrdu ? 'آن لائن داخلہ' : 'Online Form'}</div>
                    <div className="text-xs text-red-200">{isUrdu ? 'سیشن 2025-26' : 'Session 2025-26'}</div>
                  </div>
                  <div className="bg-red-950/80 p-3.5 rounded-2xl border border-red-800/80">
                    <div className="text-xl font-black text-yellow-300">{isUrdu ? 'ماہ بہ ماہ' : 'Monthly'}</div>
                    <div className="text-xs text-red-200">{isUrdu ? 'فیس واؤچرز' : 'Fee Records'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Admissions Open Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white rounded-3xl shadow-2xl p-6 sm:p-8 border-4 border-yellow-400 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-red-950 flex items-center justify-center shrink-0 shadow-lg">
              <UserPlus className="w-8 h-8 text-red-950" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-yellow-300 text-red-950 text-xs font-black uppercase mb-1">
                {isUrdu ? 'نئے داخلے 2025–2026' : 'Admissions 2025–2026'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif-brand">
                {isUrdu ? 'پلے گروپ تا میٹرک (سائنس و آرٹس) میں داخلے جاری ہیں' : 'Admissions Open from Playgroup to 10th Class (Science/Arts)'}
              </h2>
              <p className="text-red-100 text-xs sm:text-sm mt-0.5">
                {isUrdu
                  ? 'محدود نشستیں! اپنے بچے کے روشن مستقبل کیلئے آج ہی آن لائن فارم پر کریں یا دفتر تشریف لائیں۔'
                  : 'Merit-based admissions under BISE Peshawar curriculum. Apply online or visit our Peshawar Cantt campus.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('admissions')}
              className="px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>{isUrdu ? 'آن لائن داخلہ فارم' : 'Apply Online Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:03000598873"
              className="px-4 py-3.5 rounded-xl bg-red-950 hover:bg-red-900 text-yellow-300 font-bold text-sm border border-red-600 transition flex items-center gap-1.5"
              title="Call Admissions Helpline"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">0300-0598873</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Quick-Access Service Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-red-200 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-red-100 gap-2">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-serif-brand flex items-center gap-2">
                <span className="w-3 h-7 bg-red-700 rounded-sm inline-block"></span>
                <span>{t('quickServices')}</span>
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                {t('quickServicesSub')}
              </p>
            </div>
            <div className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
              Peshawar Cantt Digital Desk
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Card 1: Admissions */}
            <button
              onClick={() => onNavigate('admissions')}
              className="group text-left p-6 rounded-2xl border-2 border-red-300 hover:border-red-700 bg-gradient-to-br from-red-50 to-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center mb-4 shadow group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                  {isUrdu ? '۱۔ آن لائن داخلہ' : '1. Admissions'}
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                  {isUrdu ? 'داخلہ 2025–26' : 'Admissions 2025–26'}
                </h3>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  {isUrdu ? 'پلے گروپ تا دسویں جماعت آن لائن داخلہ فارم اور درخواست اسٹیٹس۔' : 'Online registration form for Playgroup to Matric (Science/Arts).'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-red-100 flex items-center justify-between text-xs font-bold text-red-700">
                <span>{isUrdu ? 'داخلہ لیں' : 'Apply Online'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card 2: Check Result */}
            <button
              onClick={() => onNavigate('results')}
              className="group text-left p-6 rounded-2xl border-2 border-stone-200 hover:border-red-600 bg-gradient-to-br from-stone-50 to-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center mb-4 shadow group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                  {isUrdu ? '۲۔ امتحانی رزلٹ' : '2. Results'}
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                  {t('cardResultTitle')}
                </h3>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  {t('cardResultDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-red-700">
                <span>{t('cardResultAction')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card 3: Check Fees */}
            <button
              onClick={() => onNavigate('fees')}
              className="group text-left p-6 rounded-2xl border-2 border-stone-200 hover:border-red-600 bg-gradient-to-br from-stone-50 to-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center mb-4 shadow group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                  {isUrdu ? '۳۔ ماہانہ فیس' : '3. Fees'}
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                  {t('cardFeeTitle')}
                </h3>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  {t('cardFeeDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-red-700">
                <span>{t('cardFeeAction')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card 4: Notifications */}
            <button
              onClick={() => onNavigate('notifications')}
              className="group text-left p-6 rounded-2xl border-2 border-stone-200 hover:border-red-600 bg-gradient-to-br from-stone-50 to-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center mb-4 shadow group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                  {isUrdu ? '۴۔ نوٹس بورڈ' : '4. Notices'}
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                  {t('cardNoticeTitle')}
                </h3>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  {t('cardNoticeDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-red-700">
                <span>{t('cardNoticeAction')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card 5: Contact School */}
            <button
              onClick={() => onNavigate('contact')}
              className="group text-left p-6 rounded-2xl border-2 border-stone-200 hover:border-red-600 bg-gradient-to-br from-stone-50 to-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center mb-4 shadow group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                  {isUrdu ? '۵۔ کیمپس رابطہ' : '5. Contact'}
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                  {isUrdu ? 'رابطہ و ہیلپ لائن' : 'Contact & Helpline'}
                </h3>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  {isUrdu ? 'پرنسپل حسن روز، کیمپس لوکیشن اور دفتری اوقات۔' : 'Principal Hassan Rooz office, visiting hours and helplines.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-red-700">
                <span>{isUrdu ? 'رابطہ کریں' : 'Contact Us'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Principal Message Section - Prestigious Red & Gold Frame */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border-4 border-yellow-500 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-yellow-400 text-red-950 flex items-center justify-center font-black text-3xl shadow-2xl mb-4 border-4 border-red-800">
                HR
              </div>
              <h3 className="text-2xl font-black font-serif-brand text-yellow-400">
                Hassan Rooz
              </h3>
              <p className="text-sm text-red-200 font-semibold mt-1">
                {isUrdu ? 'پرنسپل و ڈائریکٹر، ایچ آر کے ایجوکیشن سسٹم' : 'Principal & Director, HRK Education System'}
              </p>
              <div className="mt-3 px-3 py-1 rounded-full bg-red-800 text-xs text-yellow-300 font-mono font-bold border border-red-700">
                Helpline: 0300-0598873
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/80 text-yellow-300 text-xs font-bold border border-red-700">
                <Award className="w-4 h-4" />
                <span>{t('principalMsgTitle')}</span>
              </div>

              <blockquote className="text-base sm:text-xl text-red-100 italic leading-relaxed font-serif">
                {t('principalMsgQuote')}
              </blockquote>

              <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm text-red-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span>BISE Peshawar Registered Curriculum</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span>Modern Science & Computer Labs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span>Experienced Academic Faculty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Latest Notices Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b-2 border-red-200 pb-4">
          <div>
            <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
              {isUrdu ? 'تازہ ترین اعلانات' : 'Administrative Updates'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-brand">
              {isUrdu ? 'سرکاری نوٹس بورڈ و سرکلر' : 'Official School Announcements'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('notifications')}
            className="text-xs sm:text-sm font-bold text-red-700 hover:text-red-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{isUrdu ? 'تمام اعلانات دیکھیں' : 'View All Notices'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
            {isUrdu ? 'اعلانات لوڈ ہو رہے ہیں...' : 'Loading official announcements...'}
          </div>
        ) : latestNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNotices.map((n) => {
              const categoryColors: Record<string, string> = {
                Exam: 'bg-red-100 text-red-800 border-red-200',
                Holiday: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                Meeting: 'bg-purple-100 text-purple-800 border-purple-200',
                Fee: 'bg-blue-100 text-blue-800 border-blue-200',
                Important: 'bg-amber-100 text-amber-800 border-amber-200',
                General: 'bg-stone-100 text-stone-800 border-stone-200',
              };
              const badgeClass = categoryColors[n.category] || categoryColors.General;

              return (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl border-2 border-stone-200 hover:border-red-600 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${badgeClass}`}>
                        {n.category}
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {n.date}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>{isUrdu ? 'جاری کردہ: انتظامیہ' : 'Administration'}</span>
                    <button
                      onClick={() => onNavigate('notifications')}
                      className="font-bold text-red-700 hover:underline cursor-pointer"
                    >
                      {isUrdu ? 'مکمل پڑھیں ←' : 'Read full →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500">
            {isUrdu ? 'فی الوقت کوئی نیا اعلان نہیں ہے۔' : 'No public notifications published yet.'}
          </div>
        )}
      </section>
    </div>
  );
};
