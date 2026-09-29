import React, { useEffect, useState } from 'react';
import { NotificationItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar,
  Search,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

export const PublicNotificationsPage: React.FC = () => {
  const { t, isUrdu } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'All', labelEn: 'All Categories', labelUr: 'تمام اعلانات' },
    { key: 'Exam', labelEn: 'Exam', labelUr: 'امتحانی شیڈول' },
    { key: 'Holiday', labelEn: 'Holiday', labelUr: 'تعطیلات' },
    { key: 'Fee', labelEn: 'Fee Reminder', labelUr: 'فیس نوٹس' },
    { key: 'Meeting', labelEn: 'PTM Meeting', labelUr: 'والدین میٹنگ' },
    { key: 'Important', labelEn: 'Important', labelUr: 'ضروری اطلاع' },
    { key: 'General', labelEn: 'General', labelUr: 'عام اعلانات' },
  ];

  useEffect(() => {
    fetchNotifications();
  }, [selectedCategory]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const url =
        selectedCategory && selectedCategory !== 'All'
          ? `/api/public/notifications?category=${selectedCategory}`
          : '/api/public/notifications';

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notifications.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
  });

  const categoryStyles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    Exam: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: 'text-red-600' },
    Holiday: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', icon: 'text-emerald-600' },
    Fee: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: 'text-blue-600' },
    Meeting: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', icon: 'text-purple-600' },
    Important: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: 'text-amber-600' },
    General: { bg: 'bg-stone-50', text: 'text-stone-800', border: 'border-stone-200', icon: 'text-stone-600' },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Megaphone className="w-4 h-4 text-amber-700" />
          <span>{isUrdu ? 'سرکاری نوٹس بورڈ' : 'Official Circulars & Notice Board'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif-brand">
          {t('noticeTitle')}
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          {t('noticeSub')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {isUrdu ? cat.labelUr : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchNotices')}
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-xs sm:text-sm text-stone-800 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
            <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            {isUrdu ? 'اعلانات لوڈ ہو رہے ہیں...' : 'Loading announcements from database...'}
          </div>
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((n) => {
            const style = categoryStyles[n.category] || categoryStyles.General;
            return (
              <article
                key={n.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden space-y-3"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2 ${
                    n.category === 'Exam'
                      ? 'bg-red-700'
                      : n.category === 'Holiday'
                      ? 'bg-emerald-600'
                      : n.category === 'Fee'
                      ? 'bg-blue-600'
                      : n.category === 'Meeting'
                      ? 'bg-purple-600'
                      : 'bg-amber-600'
                  }`}
                ></div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
                      {n.category}
                    </span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-stone-500 font-medium">
                      {isUrdu ? `جاری کردہ: ${n.author || 'انتظامیہ'}` : `By ${n.author || 'Administration'}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold bg-stone-50 px-2.5 py-1 rounded-md font-mono">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{n.date}</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                  {n.title}
                </h2>

                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                  {n.message}
                </p>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>{isUrdu ? 'ایچ آر کے ایجوکیشن سسٹم • پشاور کینٹ' : 'HRK Education System • Peshawar Cantt'}</span>
                  <span className="font-semibold text-stone-500">{isUrdu ? 'سرکاری سرکلر' : 'Official Circular'}</span>
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 space-y-2">
            <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
            <div className="font-bold text-stone-700">{isUrdu ? 'کوئی اعلان نہیں ملا' : 'No Announcements Found'}</div>
            <p className="text-xs text-stone-500">
              {isUrdu ? 'آپ کے منتخب کردہ زمرے میں فی الحال کوئی اعلان موجود نہیں ہے۔' : 'There are no circulars matching your current filter criteria.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
