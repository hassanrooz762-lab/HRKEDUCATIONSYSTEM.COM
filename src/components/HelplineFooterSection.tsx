import React from 'react';
import { Phone, MapPin, User, Clock, MessageCircle, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HelplineFooterSection: React.FC = () => {
  const { isUrdu } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white border-t-4 border-b-4 border-yellow-500 py-10 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden no-print">
      {/* Decorative background glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs sm:text-sm font-bold tracking-wide uppercase mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>{isUrdu ? 'سرکاری ہیلپ لائن، پرنسپل اور کیمپس رابطہ' : 'Official Helplines, Principal & Campus Directory'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-brand">
            {isUrdu ? 'ایچ آر کے ایجوکیشن سسٹم • پشاور کینٹ' : 'HRK EDUCATION SYSTEM • PESHAWAR CANTT'}
          </h2>
          <p className="text-red-200 text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            {isUrdu
              ? 'کسی بھی قسم کی معلومات، رزلٹ تصدیق، فیس استفسار یا نئے داخلوں کیلئے پرنسپل حسن روز اور ایڈمنسٹریشن سے براہِ راست رابطہ فرمائیں۔'
              : 'Direct access to institutional leadership, admissions office, student transcripts, and fee desk.'}
          </p>
        </div>

        {/* 3 Main Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Helplines */}
          <div className="bg-red-900/60 backdrop-blur-sm border-2 border-red-700/80 hover:border-yellow-400 rounded-2xl p-6 shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-700 flex items-center justify-center text-white shadow-md border border-red-500">
                  <Phone className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-yellow-400 tracking-wider block">
                    {isUrdu ? 'سرکاری رابطہ نمبرز' : 'Direct Helpline Desk'}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {isUrdu ? 'ہیلپ لائن نمبرز' : 'Helpline Numbers'}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="bg-red-950/80 rounded-xl p-3 border border-red-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-red-300 font-semibold block">
                      {isUrdu ? 'پرنسپل و واٹس ایپ ہیلپ لائن' : 'Primary Line / WhatsApp'}
                    </span>
                    <a
                      href="tel:03000598873"
                      className="text-base sm:text-lg font-mono font-bold text-yellow-300 hover:text-white transition"
                    >
                      0300-0598873
                    </a>
                  </div>
                  <div className="flex gap-1.5">
                    <a
                      href="tel:03000598873"
                      className="p-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition"
                      title="Call Now"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <a
                      href="https://wa.me/923000598873"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                      title="WhatsApp Chat"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="bg-red-950/80 rounded-xl p-3 border border-red-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-red-300 font-semibold block">
                      {isUrdu ? 'داخلہ و معلومات ہیلپ لائن' : 'Admissions & Secondary Desk'}
                    </span>
                    <a
                      href="tel:03005442333"
                      className="text-base sm:text-lg font-mono font-bold text-yellow-300 hover:text-white transition"
                    >
                      0300-5442333
                    </a>
                  </div>
                  <a
                    href="tel:03005442333"
                    className="p-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition"
                    title="Call Now"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-red-800/80 flex items-center gap-2 text-xs text-red-200">
              <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{isUrdu ? 'اوقات: صبح 7:45 تا دوپہر 3:00 (پیر تا ہفتہ)' : 'Available Mon-Sat: 7:45 AM - 3:00 PM'}</span>
            </div>
          </div>

          {/* Card 2: Principal Info */}
          <div className="bg-red-900/60 backdrop-blur-sm border-2 border-red-700/80 hover:border-yellow-400 rounded-2xl p-6 shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-red-950 shadow-md font-black">
                  <User className="w-6 h-6 text-red-950" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-yellow-400 tracking-wider block">
                    {isUrdu ? 'سربراہ ادارہ' : 'Head of Institution'}
                  </span>
                  <h3 className="text-xl font-black text-white font-serif-brand">
                    {isUrdu ? 'پرنسپل: حسن روز' : 'Principal: Hassan Rooz'}
                  </h3>
                </div>
              </div>

              <div className="bg-red-950/80 rounded-xl p-4 border border-red-800 space-y-2">
                <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isUrdu ? 'پرنسپل و ڈائریکٹر ایچ آر کے ایجوکیشن سسٹم' : 'Principal & Managing Director'}</span>
                </div>
                <p className="text-xs text-red-200 leading-relaxed">
                  {isUrdu
                    ? 'تعلیم و تربیت کا اعلیٰ معیار، طلباء کی کردار سازی اور روشن تعلیمی مستقبل پرنسپل حسن روز کی اولین ترجیح ہے۔'
                    : 'Dedicated to fostering scholastic brilliance, moral uprightness, and future-ready character among students.'}
                </p>
                <div className="pt-2 text-xs text-yellow-200 flex items-center gap-1 font-semibold">
                  <span>{isUrdu ? 'براہِ راست ملاقات:' : 'Direct Meeting Hours:'}</span>
                  <span className="text-white">9:00 AM – 1:30 PM</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-red-800/80 flex items-center justify-between text-xs">
              <span className="text-red-200">{isUrdu ? 'دفتری رابطہ:' : 'Office Contact:'}</span>
              <a
                href="tel:03000598873"
                className="font-bold text-yellow-300 hover:underline"
              >
                0300-0598873
              </a>
            </div>
          </div>

          {/* Card 3: Location & Campus */}
          <div className="bg-red-900/60 backdrop-blur-sm border-2 border-red-700/80 hover:border-yellow-400 rounded-2xl p-6 shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-700 flex items-center justify-center text-white shadow-md border border-red-500">
                  <MapPin className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-yellow-400 tracking-wider block">
                    {isUrdu ? 'کیمپس لوکیشن و پتہ' : 'School Campus Location'}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {isUrdu ? 'پشاور کینٹ کیمپس' : 'Peshawar Cantt'}
                  </h3>
                </div>
              </div>

              <div className="bg-red-950/80 rounded-xl p-4 border border-red-800 space-y-2">
                <p className="text-sm font-bold text-white leading-snug">
                  Main Road, Near to Ras Shadi Hall, Peshawar Cantt, Pakistan
                </p>
                <p className="text-xs text-yellow-300 font-urdu leading-normal">
                  مین روڈ، نزد رس شادی ہال، پشاور کینٹ، خیبر پختونخوا
                </p>
                <p className="text-xs text-red-300">
                  {isUrdu ? 'آسان رسائی، کشادہ پارکنگ اور محفوظ ماحول۔' : 'Easily accessible from Saddar, Warsak Road, & GT Road.'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-red-800/80">
              <a
                href="https://maps.google.com/?q=Main+Road+Near+Ras+Shadi+Hall+Peshawar+Cantt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-red-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <span>{isUrdu ? 'گوگل میپس پر لوکیشن دیکھیں' : 'View on Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
