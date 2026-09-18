import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Clock, 
  Save, 
  RotateCcw, 
  Flame, 
  CheckCircle2, 
  Sun, 
  Moon, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { initialStudentProfile } from '../../data/mockData';
import { DegreeType, EngineeringBranch, AcademicYear, CareerRole } from '../../types';

export const ProfileSettingsScreen: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [degree, setDegree] = useState<DegreeType>(user?.degree || 'B.Tech / B.E.');
  const [branch, setBranch] = useState<EngineeringBranch>(
    user?.branch || 'Computer Science & Engg (CSE)'
  );
  const [year, setYear] = useState<AcademicYear>(user?.year || '3rd Year');
  const [careerInterest, setCareerInterest] = useState<CareerRole>(
    (user?.careerInterest as CareerRole) || 'Software Developer'
  );
  const [dailyHours, setDailyHours] = useState(user?.dailyStudyTargetHours || 3.5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      college,
      degree,
      branch,
      year,
      careerInterest,
      dailyStudyTargetHours: dailyHours
    });
    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset student profile to default Alex Rivers B.Tech CSE demo state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <User className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <span>Student Profile & Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your university details, academic goals, and application preferences
        </p>
      </div>

      {/* Student Badge Card */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl border border-white/20">
            {name ? name.charAt(0) : 'S'}
          </div>
          <div>
            <h3 className="text-xl font-bold">{name || 'Alex Rivers'}</h3>
            <p className="text-xs text-indigo-100">{branch} • {year}</p>
            <p className="text-xs text-indigo-200 mt-0.5">{college}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/15">
          <div className="text-center px-2">
            <span className="text-base sm:text-lg font-black block">{user?.studyStreakDays || 14}</span>
            <span className="text-[10px] text-indigo-200 uppercase font-semibold">Streak</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="text-center px-2">
            <span className="text-base sm:text-lg font-black block">{user?.totalStudyHours || 42.5}</span>
            <span className="text-[10px] text-indigo-200 uppercase font-semibold">Hours</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="text-center px-2">
            <span className="text-base sm:text-lg font-black block">{user?.topicsMasteredCount || 28}</span>
            <span className="text-[10px] text-indigo-200 uppercase font-semibold">Mastered</span>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
          Academic Information
        </h4>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Degree
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value as DegreeType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                {['B.Tech / B.E.', 'BCA', 'B.Sc', 'M.Tech / M.S.', 'MCA', 'Other'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value as EngineeringBranch)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as AcademicYear)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Career Role
              </label>
              <select
                value={careerInterest}
                onChange={(e) => setCareerInterest(e.target.value as CareerRole)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                {[
                  'Software Developer',
                  'AI/ML Engineer',
                  'Semiconductor / VLSI Engineer',
                  'Embedded Systems Engineer',
                  'Data Analyst',
                  'Cloud & DevOps Engineer'
                ].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Daily Study Target ({dailyHours} hours/day)
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes saved successfully!</span>
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* App Preferences & Reset */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
          App Preferences & Data
        </h4>

        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Appearance Theme
            </div>
            <div className="text-[11px] text-slate-400">
              Current theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>Toggle to {theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Reset Demo Data
            </div>
            <div className="text-[11px] text-slate-400">
              Restores initial mock study plans, pre-loaded notes and sample exams
            </div>
          </div>
          <button
            onClick={handleResetDemoData}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-600 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="font-bold text-xs text-rose-600">
              Sign Out
            </div>
            <div className="text-[11px] text-slate-400">
              Log out of your student session
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
