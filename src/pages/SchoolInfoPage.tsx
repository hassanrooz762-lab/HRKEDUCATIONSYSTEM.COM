import React from 'react';
import { Crest } from '../components/Crest';
import {
  Award,
  BookOpen,
  Users,
  CheckCircle,
  Building,
  GraduationCap,
  Shield,
  Lightbulb,
  HeartHandshake,
  Compass,
  MapPin,
  Phone,
} from 'lucide-react';

interface SchoolInfoPageProps {
  onNavigate: (tab: string) => void;
}

export const SchoolInfoPage: React.FC<SchoolInfoPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Banner */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <Crest size="xl" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4 text-red-700" />
          <span>About HRK Education System</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 font-serif-brand">
          Tradition of Integrity & Academic Stature
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          HRK Education System is founded on the unyielding principle that quality education should cultivate sharp minds, compassionate hearts, and disciplined citizens.
        </p>
      </div>

      {/* Leadership Profile: Principal Hassan Rooz */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-red-800 via-red-600 to-yellow-500 p-1.5 shadow-2xl">
              <div className="w-full h-full rounded-full bg-stone-950 flex flex-col items-center justify-center text-center">
                <span className="font-serif-brand text-4xl sm:text-5xl font-extrabold text-yellow-400">HR</span>
                <span className="text-[10px] tracking-widest uppercase text-red-400 font-bold mt-1">Principal</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mt-4 font-serif-brand">Hassan Rooz</h2>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Principal & Academic Director</p>
            <p className="text-stone-400 text-xs mt-1">HRK Education System, Peshawar Cantt</p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              Principal’s Vision & Leadership
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Under the visionary leadership of Principal <strong>Hassan Rooz</strong>, HRK Education System has evolved into a cornerstone of secondary and higher secondary education in Peshawar Cantt. With decades of instructional insight and institutional dedication, Principal Rooz champions an educational paradigm centered on personalized mentorship, high moral standards, and scientific proficiency.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-300">
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Modern science laboratories</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated faculty with subject mastery</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Digital transcripts & automated fee ledgers</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Continuous parent-teacher communication</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities & Infrastructure */}
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-red-700">Campus Highlights</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Modern Educational Facilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">Integrated Science Labs</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Equipped with modern apparatus for Physics, Chemistry, and Biology to facilitate practical syllabus requirements for BISE Peshawar SSC examinations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">Comprehensive Library</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Extensive academic reference collections, Islamic classical texts, English and Urdu literature, and past board examination papers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">Safe & Secure Campus</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Conveniently situated on Main Road, Peshawar Cantt near Ras Shadi Hall with round-the-clock security surveillance and trained gate personnel.
            </p>
          </div>
        </div>
      </div>

      {/* Admission & Class Wings */}
      <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900">Academic Programs & Sections</h3>
            <p className="text-stone-500 text-xs sm:text-sm">Classes offered under the HRK Education System academic curriculum</p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow transition"
          >
            Inquire About Admissions
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold uppercase text-red-700">Primary Wing</div>
            <div className="text-lg font-bold text-stone-900">Class 1st to 5th</div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Foundational literacy in Urdu, English, Mathematics, General Science, and Nazra Quran with Tajweed.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold uppercase text-blue-700">Middle Wing</div>
            <div className="text-lg font-bold text-stone-900">Class 6th to 8th</div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Conceptual development in Science, Computer Studies, Social Studies, and Arabic / Islamic Ethics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold uppercase text-emerald-700">Secondary (Matric) Wing</div>
            <div className="text-lg font-bold text-stone-900">Class 9th & 10th</div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Affiliated with BISE Peshawar. Specialization in Science (Biology / Computer Science) with practical lab work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
