import React from 'react';
import { Crest } from './Crest';
import { HelplineFooterSection } from './HelplineFooterSection';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Award,
  BookOpen,
  User,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { isUrdu } = useLanguage();

  return (
    <footer className="no-print">
      {/* 1. Official Helplines, Principal & Location Banner (Visible at bottom of all pages) */}
      <HelplineFooterSection />

      {/* 2. Deep Red Institutional Footer Columns */}
      <div className="bg-gradient-to-b from-red-950 via-stone-950 to-black text-stone-300 pt-16 pb-8 border-t-2 border-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Column 1: School Identity & Mission */}
            <div className="space-y-4">
              <Crest size="md" variant="dark" />
              <p className="text-red-100/80 text-sm leading-relaxed mt-4">
                {isUrdu
                  ? 'ایچ آر کے ایجوکیشن سسٹم پشاور کینٹ کا ایک معتبر اور معیاری تعلیمی ادارہ ہے جو پرنسپل حسن روز کی زیرِ قیادت طلباء میں علمی قابلیت، اخلاقی شعور اور روشن مستقبل کی صلاحیتیں پروان چڑھا رہا ہے۔'
                  : 'HRK Education System is a premier educational institution in Peshawar Cantt, committed to academic excellence, character building, and preparing leaders of tomorrow under the vision of Principal Hassan Rooz.'}
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-yellow-400 font-semibold flex-wrap">
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-red-400" />
                  BISE Peshawar Affiliated
                </span>
                <span className="text-stone-600">•</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Modern Science Labs
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-red-900/60 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>{isUrdu ? 'اہم آن لائن پورٹلز' : 'Portals & Quick Links'}</span>
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => onNavigate('home')}
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 text-stone-300 cursor-pointer"
                  >
                    <span className="text-red-500 font-bold">›</span> {isUrdu ? 'مرکزی صفحہ' : 'Home Overview'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('admissions')}
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 text-stone-300 cursor-pointer"
                  >
                    <span className="text-red-500 font-bold">›</span>
                    <span className="font-bold text-yellow-400">{isUrdu ? 'آن لائن داخلہ فارم 2025-2026' : 'Online Admissions 2025-26'}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-700 text-white font-bold">NEW</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('results')}
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 text-stone-300 cursor-pointer"
                  >
                    <span className="text-red-500 font-bold">›</span> {isUrdu ? 'امتحانی رزلٹ و مارک شیٹ' : 'Search Exam Results'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('fees')}
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 text-stone-300 cursor-pointer"
                  >
                    <span className="text-red-500 font-bold">›</span> {isUrdu ? 'ماہانہ فیس کی تصدیق' : 'Monthly Fee Breakdown'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('notifications')}
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 text-stone-300 cursor-pointer"
                  >
                    <span className="text-red-500 font-bold">›</span> {isUrdu ? 'اسکول نوٹس بورڈ و اعلانات' : 'Announcements & Circulars'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 text-stone-300 cursor-pointer"
                  >
                    <span className="text-red-500 font-bold">›</span> {isUrdu ? 'پرنسپل و ادارے کا تعارف' : 'About Principal & Leadership'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 text-stone-300 cursor-pointer"
                  >
                    <span className="text-red-500 font-bold">›</span> {isUrdu ? 'کیمپس لوکیشن و رابطہ' : 'Location & Visiting Hours'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Campus Info */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-red-900/60 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span>{isUrdu ? 'پشاور کینٹ کیمپس' : 'Peshawar Cantt Campus'}</span>
              </h3>
              <ul className="space-y-3 text-sm text-stone-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Main Road, Near to Ras Shadi Hall, Peshawar Cantt, Pakistan
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <User className="w-5 h-5 text-yellow-400 shrink-0" />
                  <span className="text-yellow-200 font-semibold">
                    {isUrdu ? 'پرنسپل: حسن روز' : 'Principal: Hassan Rooz'}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="flex flex-col">
                    <a href="tel:03000598873" className="hover:text-white font-mono font-bold text-yellow-300">
                      0300-0598873
                    </a>
                    <a href="tel:03005442333" className="hover:text-white font-mono font-bold text-yellow-300">
                      0300-5442333
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <a href="mailto:info@hrkeducation.edu.pk" className="hover:text-white">
                    info@hrkeducation.edu.pk
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-red-200/80">
                    {isUrdu ? 'پیر تا ہفتہ: صبح 7:45 تا 3:00 بجے' : 'Mon – Sat: 7:45 AM – 3:00 PM'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Academic Wings & Admissions Info */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-red-900/60 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>{isUrdu ? 'داخلہ برائے 2025-2026' : 'Admissions 2025–2026'}</span>
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {isUrdu
                  ? 'پلے گروپ تا میٹرک (سائنس و آرٹس) میں داخلے جاری ہیں۔ پراسپیکٹس اور آن لائن رجسٹریشن کے لیے ابھی رجوع کریں۔'
                  : 'Admissions are open for Playgroup through Matric (Science & Arts). Limited seats available on merit.'}
              </p>
              <div className="bg-red-950/70 border border-red-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>BISE Peshawar Registered Curriculum</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Experienced Subject Specialists</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tarjuma-tul-Quran & Ethics Education</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('admissions')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{isUrdu ? 'آن لائن داخلہ فارم بھریں' : 'Fill Online Admission Form'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Bar with Discreet Hidden Access Trigger (Praised by user) */}
          <div className="pt-8 mt-8 border-t border-red-900/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-400">
            <p>© {new Date().getFullYear()} HRK Education System, Peshawar Cantt. All Rights Reserved.</p>
            <div className="flex items-center gap-3">
              <span className="text-yellow-300/80">Principal: Hassan Rooz</span>
              <span>•</span>
              <span className="font-mono">Helpline: 0300-0598873</span>
              {/* Subtle, unnoticeable hidden lock for authorized personnel only */}
              <button
                onClick={() => onNavigate('staff-portal')}
                className="text-stone-700 hover:text-stone-400 transition-colors p-0.5 ml-2 cursor-pointer focus:outline-none"
                title="Internal Management System"
                aria-label="Internal Administration"
              >
                <svg className="w-3.5 h-3.5 inline-block opacity-30 hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
