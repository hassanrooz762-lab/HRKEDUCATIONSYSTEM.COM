import React, { useState } from 'react';
import { Crest } from './Crest';
import { useLanguage } from '../context/LanguageContext';
import {
  Phone,
  MapPin,
  Menu,
  X,
  GraduationCap,
  FileText,
  CreditCard,
  Bell,
  Info,
  User,
  Languages,
  UserPlus,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t, isUrdu } = useLanguage();

  const navItems = [
    { id: 'home', labelKey: 'navHome', icon: GraduationCap },
    { id: 'admissions', labelKey: 'navAdmissions', icon: UserPlus, highlight: true },
    { id: 'results', labelKey: 'navResults', icon: FileText },
    { id: 'fees', labelKey: 'navFees', icon: CreditCard },
    { id: 'notifications', labelKey: 'navNotices', icon: Bell },
    { id: 'about', labelKey: 'navAbout', icon: Info },
    { id: 'contact', labelKey: 'navContact', icon: Phone },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ur' : 'en');
  };

  return (
    <header className="w-full bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white shadow-xl sticky top-0 z-50 no-print border-b-2 border-red-700">
      {/* Top Banner with Official School Info & Contacts & Language Switcher */}
      <div className="bg-red-950/90 text-red-100 text-xs py-1.5 px-4 border-b border-red-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Location & Principal */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-red-100">
              <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="truncate max-w-xs sm:max-w-none text-[11px] sm:text-xs">
                {t('schoolLocation')}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-yellow-300">
              <span className="text-red-600">|</span>
              <User className="w-3.5 h-3.5" />
              <span>{t('principalTitle')}: <strong className="text-white">{t('principalName')}</strong></span>
            </div>
          </div>

          {/* Right: Phone Numbers & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-red-300 hidden sm:inline text-[11px] font-semibold">{t('helpline')}:</span>
            <a
              href="tel:03000598873"
              className="flex items-center gap-1 text-yellow-300 hover:text-white font-mono font-bold transition-colors text-xs"
              title="Call Helpline"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>0300-0598873</span>
            </a>
            <span className="text-red-700 hidden sm:inline">/</span>
            <a
              href="tel:03005442333"
              className="hidden sm:flex items-center gap-1 text-yellow-300 hover:text-white font-mono font-bold transition-colors text-xs"
              title="Call Admissions"
            >
              <span>0300-5442333</span>
            </a>

            {/* Language Switcher Button (English / اردو) */}
            <button
              onClick={toggleLanguage}
              className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500 hover:bg-yellow-400 text-red-950 text-xs font-black transition shadow-sm cursor-pointer"
              title={isUrdu ? 'Switch to English' : 'اردو میں دیکھیں'}
            >
              <Languages className="w-3 h-3 text-red-950" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Crest with School Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-xl p-1 cursor-pointer"
          >
            <Crest size="md" variant="dark" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-yellow-400 text-red-950 shadow-md font-black'
                      : item.highlight
                      ? 'bg-red-800 hover:bg-red-700 text-yellow-300 border border-yellow-400/50 shadow-sm'
                      : 'text-red-100 hover:bg-red-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-950' : item.highlight ? 'text-yellow-300' : 'text-red-300'}`} />
                  <span>{t(item.labelKey)}</span>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-red-800 hover:bg-red-700 text-white focus:outline-none cursor-pointer border border-red-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-yellow-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-red-950 border-t-2 border-red-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="pb-2 border-b border-red-800/60 flex items-center justify-between text-xs text-red-200">
            <span className="font-bold text-yellow-400 uppercase tracking-wider">{t('schoolName')}</span>
            <span>Peshawar Cantt</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-yellow-400 text-red-950 shadow font-black'
                      : 'text-red-100 hover:bg-red-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-950' : 'text-yellow-400'}`} />
                    <span>{t(item.labelKey)}</span>
                  </div>
                  {item.highlight && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-700 text-yellow-300 font-bold">
                      OPEN
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Direct Call Helplines in Mobile Menu */}
          <div className="mt-4 pt-4 border-t border-red-800/80 space-y-2">
            <div className="text-xs font-bold text-yellow-400 uppercase">
              {isUrdu ? 'ہیلپ لائن پر براہِ راست رابطہ کریں:' : 'Direct Helplines:'}
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="tel:03000598873"
                className="py-2.5 px-4 rounded-xl bg-red-800 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center justify-between border border-red-700"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>0300-0598873</span>
                </div>
                <span className="text-[11px] text-yellow-300">Principal Desk</span>
              </a>
              <a
                href="tel:03005442333"
                className="py-2.5 px-4 rounded-xl bg-red-800 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center justify-between border border-red-700"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>0300-5442333</span>
                </div>
                <span className="text-[11px] text-yellow-300">Admissions Desk</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
