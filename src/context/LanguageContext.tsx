import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isUrdu: boolean;
}

const translations: Record<string, { en: string; ur: string }> = {
  // Brand
  schoolName: { en: 'HRK Education System', ur: 'ایچ آر کے ایجوکیشن سسٹم' },
  schoolLocation: { en: 'Main Road, Near to Ras Shadi Hall, Peshawar Cantt, Pakistan', ur: 'مین روڈ، نزد رس شادی ہال، پشاور کینٹ، پاکستان' },
  principalName: { en: 'Hassan Rooz', ur: 'حسن روز' },
  principalTitle: { en: 'Principal', ur: 'پرنسپل' },
  helpline: { en: 'Helpline', ur: 'ہیلپ لائن' },
  tagline: { en: 'Nurturing Excellence, Character & Knowledge', ur: 'تعلیم، اخلاق اور علم کا روشن مینار' },
  campus: { en: 'Peshawar Cantt Campus', ur: 'پشاور کینٹ کیمپس' },

  // Navigation
  navHome: { en: 'Home', ur: 'مرکزی صفحہ' },
  navAdmissions: { en: 'Admissions 2025–26', ur: 'آن لائن داخلہ' },
  navResults: { en: 'Check Results', ur: 'امتحانی رزلٹ' },
  navFees: { en: 'Check Fees', ur: 'ماہانہ فیس' },
  navNotices: { en: 'Notifications', ur: 'اعلانات' },
  navAbout: { en: 'School Info', ur: 'ادارے کا تعارف' },
  navContact: { en: 'Contact', ur: 'رابطہ و پتہ' },

  // Admissions Page
  admissionsTitle: { en: 'Admissions Open 2025–2026', ur: 'آن لائن داخلہ سیشن 2025-2026' },
  admissionsSub: { en: 'Apply online for Playgroup to 10th Class (Science/Arts) or verify your application status under BISE Peshawar guidelines.', ur: 'پلے گروپ تا دسویں جماعت (میٹرک سائنس و آرٹس) میں داخلے کے لیے آن لائن فارم پر کریں۔' },
  tabApplyOnline: { en: 'Online Admission Form', ur: 'آن لائن داخلہ فارم' },
  tabTrackStatus: { en: 'Track Application Status', ur: 'درخواست کا اسٹیٹس' },
  tabCriteria: { en: 'Criteria & Documents', ur: 'اہلیت و ضروری کاغذات' },
  tabFeeStructure: { en: 'Admission Fee Chart', ur: 'فیس شیڈول برائے داخلہ' },

  // Home Quick Cards
  quickServices: { en: 'Parent & Student Quick Access Services', ur: 'والدین اور طلباء کیلئے فوری آن لائن سہولیات' },
  quickServicesSub: { en: 'Select a portal service below to search transcripts, check outstanding fees, or view notices.', ur: 'امتحانی رزلٹ، فیس ریکارڈ یا اسکول کے اہم اعلانات دیکھنے کیلئے نیچے دی گئی سروس منتخب کریں۔' },
  cardResultTitle: { en: '1. Check Result', ur: '۱۔ امتحانی رزلٹ چیک کریں' },
  cardResultDesc: { en: 'Search student transcript with Roll Number, Class, Student Name, and Father Name. Up to 10 subject marks with percentages.', ur: 'رول نمبر، کلاس، نام اور والد کے نام کے ذریعے 10 مضامین کا تفصیلی رزلٹ اور پرسنٹیج چیک کریں۔' },
  cardResultAction: { en: 'Search Transcripts', ur: 'مارک شیٹ تلاش کریں' },

  cardFeeTitle: { en: '2. Check Fees', ur: '۲۔ ماہانہ فیس چیک کریں' },
  cardFeeDesc: { en: 'View individual monthly fee vouchers, paid status, outstanding balance, and official collector receipts.', ur: 'ماہ بہ ماہ فیس کی تفصیلات، ادا شدہ فیس اور بقایا بیلنس واؤچر دیکھیں۔' },
  cardFeeAction: { en: 'View Monthly Dues', ur: 'فیس ریکارڈ دیکھیں' },

  cardNoticeTitle: { en: '3. Notifications', ur: '۳۔ اہم اعلانات و سرکلر' },
  cardNoticeDesc: { en: 'Official circulars regarding BISE datesheets, parent-teacher conferences, national holidays, and school events.', ur: 'پشاور بورڈ امتحانی ڈیٹ شیٹ، چھٹیوں کے نوٹسز اور پی ٹی ایم کے نوٹیفیکیشنز۔' },
  cardNoticeAction: { en: 'Read Announcements', ur: 'اعلانات ملاحظہ کریں' },

  cardContactTitle: { en: '4. Contact School', ur: '۴۔ اسکول سے رابطہ کریں' },
  cardContactDesc: { en: 'Visit Main Road near Ras Shadi Hall, Peshawar Cantt. Directly call Principal Hassan Rooz or admissions office.', ur: 'رس شادی ہال پشاور کینٹ تشریف لائیں یا پرنسپل حسن روز اور ایڈمشن آفس کو کال کریں۔' },
  cardContactAction: { en: 'View Campus Details', ur: 'رابطہ کی تفصیلات' },

  // Principal Message
  principalMsgTitle: { en: 'Message from the Principal', ur: 'پیغامِ پرنسپل حسن روز' },
  principalMsgQuote: {
    en: '“Education is the foundation upon which the destiny of a nation is built. At HRK Education System, our priority is not merely preparing students for examinations, but shaping them into disciplined, morally upright, and intellectually curious young men and women.”',
    ur: '”تعلیم وہ بنیاد ہے جس پر قوموں کے مستقبل کی تعمیر ہوتی ہے۔ ایچ آر کے ایجوکیشن سسٹم میں ہماری ترجیح محض امتحانات کی تیاری نہیں بلکہ طلباء کو باکردار، بااخلاق اور علمی لگن سے سرشار بنانا ہے۔“',
  },

  // Results Page
  resultsTitle: { en: 'Student Examination Transcript', ur: 'طلباء کا تعلیمی رزلٹ و مارک شیٹ' },
  resultsSub: { en: 'Verify and view official academic grades, configurable subject scores, attendance marks, position, and controller remarks.', ur: 'مضامین کے نمبرات، حاضری، مجموعی پرسنٹیج، پوزیشن اور پرنسپل کے ریمارکس کی تصدیق کریں۔' },
  studentName: { en: 'Student Name', ur: 'طالب علم کا نام' },
  fatherName: { en: 'Father Name', ur: 'والد کا نام' },
  classLabel: { en: 'Class', ur: 'کلاس / جماعت' },
  rollNumber: { en: 'Roll Number', ur: 'رول نمبر' },
  searchResultBtn: { en: 'Search Result', ur: 'رزلٹ تلاش کریں' },
  verifyingRecord: { en: 'Verifying Record...', ur: 'ریکارڈ کی تصدیق جاری ہے...' },
  printTranscript: { en: 'Print / Download Transcript', ur: 'مارک شیٹ پرنٹ کریں' },
  grandTotal: { en: 'Grand Total', ur: 'کل حاصل کردہ نمبر' },
  overallPercentage: { en: 'Overall Percentage', ur: 'مجموعی پرسنٹیج' },
  paperPercentage: { en: 'Paper Percentage', ur: 'تحریری پیپر پرسنٹیج' },
  classStanding: { en: 'Class Standing / Position', ur: 'کلاس میں پوزیشن' },
  remarks: { en: 'Principal Remarks', ur: 'پرنسپل ریمارکس' },
  subjectCol: { en: 'Subject Name', ur: 'مضمون کا نام' },
  attCol: { en: 'Attendance Marks', ur: 'حاضری نمبر' },
  totalCol: { en: 'Total Marks', ur: 'کل نمبر' },
  obtCol: { en: 'Obtained Marks', ur: 'حاصل کردہ نمبر' },
  gradeCol: { en: 'Grade', ur: 'گریڈ' },

  // Fees Page
  feesTitle: { en: 'Monthly Fee Verification', ur: 'ماہانہ فیس کی تفصیلات و تصدیق' },
  feesSub: { en: 'Look up month-by-month school dues, payment verification receipts, and outstanding balances issued by Accounts Office.', ur: 'اکاؤنٹس آفس سے جاری کردہ ماہ بہ ماہ فیس، جمع شدہ رقم اور بقایا بیلنس ملاحظہ کریں۔' },
  searchFeesBtn: { en: 'Search Fees', ur: 'فیس تلاش کریں' },
  totalAssessed: { en: 'Total Fee Assessed', ur: 'کل مقررہ فیس' },
  totalPaid: { en: 'Total Paid Amount', ur: 'کل جمع شدہ رقم' },
  outstandingBalance: { en: 'Outstanding Balance', ur: 'بقایا واجب الادا بیلنس' },
  monthlyBreakdown: { en: 'Monthly Breakdown (Each Month Listed Separately)', ur: 'ماہ بہ ماہ فیس کی تفصیل (ہر مہینہ الگ درج ہے)' },
  monthCol: { en: 'Month', ur: 'مہینہ' },
  monthlyFeeCol: { en: 'Monthly Fee', ur: 'ماہانہ فیس' },
  statusCol: { en: 'Status', ur: 'حیثیت' },
  balanceCol: { en: 'Balance / Due', ur: 'بقایا رقم' },
  receivedByCol: { en: 'Received By', ur: 'وصول کنندہ' },
  printStatement: { en: 'Print Fee Voucher / Statement', ur: 'فیس واؤچر پرنٹ کریں' },
  printVoucher3Copy: { en: 'Print 3-Copy Bank Challan', ur: '۳ نقول والا بینک چالان پرنٹ کریں' },

  // Notifications
  noticeTitle: { en: 'Announcements & Circulars', ur: 'اسکول نوٹس بورڈ و اعلانات' },
  noticeSub: { en: 'Official academic schedules, holiday notices, examination schedules, and parent meetings issued by the administrative office.', ur: 'انتظامیہ کی جانب سے جاری کردہ امتحانی شیڈول، تعطیلات کے اعلانات اور ضروری ہدایات۔' },
  allCategories: { en: 'All Categories', ur: 'تمام اعلانات' },
  searchNotices: { en: 'Search circulars by keyword...', ur: 'اعلانات میں تلاش کریں...' },

  // Contact
  contactTitle: { en: 'Contact HRK Education System', ur: 'ایچ آر کے ایجوکیشن سسٹم سے رابطہ' },
  directHelplines: { en: 'Direct Helplines', ur: 'براہِ راست فون نمبرز' },
  officeHours: { en: 'Office Working Hours', ur: 'دفتری اوقات کار' },
  officeTimingsVal: { en: 'Mon – Sat: 8:00 AM – 2:30 PM (Friday: 8:00 AM – 12:30 PM)', ur: 'پیر تا ہفتہ: صبح ۸:۰۰ تا دوپہر ۲:۳۰ (جمعہ: صبح ۸:۰۰ تا ۱۲:۳۰)' },
  inquiryFormTitle: { en: 'Send an Admission or General Inquiry', ur: 'داخلہ یا معلومات کیلئے پیغام بھیجیں' },
  submitInquiry: { en: 'Submit Inquiry', ur: 'پیغام روانہ کریں' },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
  isUrdu: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hrk_lang') as Language;
      if (saved === 'en' || saved === 'ur') return saved;
    }
    return 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hrk_lang', newLang);
      document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[lang] || item.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isUrdu: lang === 'ur' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
