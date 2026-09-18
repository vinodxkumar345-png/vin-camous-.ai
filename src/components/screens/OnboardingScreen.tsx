import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Briefcase, 
  Code2, 
  Plus, 
  X 
} from 'lucide-react';
import { DegreeType, EngineeringBranch, AcademicYear, CareerRole, SkillLevel } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { completeOnboarding, user } = useAuth();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || 'National Institute of Technology');
  const [degree, setDegree] = useState<DegreeType>('B.Tech / B.E.');
  const [branch, setBranch] = useState<EngineeringBranch>('Computer Science & Engg (CSE)');
  const [year, setYear] = useState<AcademicYear>('3rd Year');
  const [subjects, setSubjects] = useState<string[]>([
    'Operating Systems',
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Computer Networks'
  ]);
  const [newSubject, setNewSubject] = useState('');
  const [careerInterest, setCareerInterest] = useState<CareerRole>('Software Developer');
  const [dailyStudyTargetHours, setDailyStudyTargetHours] = useState<number>(3);
  const [currentSkillLevel, setCurrentSkillLevel] = useState<SkillLevel>('Intermediate');

  const branches: EngineeringBranch[] = [
    'Computer Science & Engg (CSE)',
    'Information Technology (IT)',
    'Data Science & AI',
    'Electronics & Communication (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Biotechnology',
    'Other'
  ];

  const degrees: DegreeType[] = ['B.Tech / B.E.', 'BCA', 'B.Sc', 'M.Tech / M.S.', 'MCA', 'Other'];
  const years: AcademicYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const careers: CareerRole[] = [
    'Software Developer',
    'AI/ML Engineer',
    'Data Analyst',
    'Semiconductor / VLSI Engineer',
    'Embedded Systems Engineer',
    'Cloud & DevOps Engineer',
    'Cybersecurity Specialist'
  ];

  const skillLevels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (sub: string) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  const handleFinish = async () => {
    await completeOnboarding({
      name: name.trim() || 'Student',
      college: college.trim() || 'Engineering College',
      degree,
      branch,
      year,
      subjects,
      careerInterest,
      dailyStudyTargetHours,
      currentSkillLevel,
      onboardingCompleted: true
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Student Profile Setup</span>
            <span>Step {step} of 3</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* STEP 1: Personal & College Info */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    College & Academic Profile
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Let's personalize CampusAI to your syllabus and curriculum
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivers"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. ABC Institute of Technology"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Degree
                  </label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value as DegreeType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {degrees.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as AcademicYear)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Branch / Specialization
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {branches.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBranch(b)}
                      className={`text-left text-xs p-2.5 rounded-xl border transition-all ${
                        branch === b
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
                >
                  <span>Continue to Subjects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Current Subjects */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Current Semester Subjects
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add the courses you're studying right now for tailored study plans
                  </p>
                </div>
              </div>

              {/* Subject Tag List */}
              <div className="flex flex-wrap gap-2 min-h-16 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                {subjects.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-medium border border-slate-200 dark:border-slate-600 shadow-xs"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => removeSubject(sub)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Subject Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                  placeholder="e.g. Compiler Design, Microprocessors, Signals & Systems..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-medium">Quick suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Operating Systems', 'Computer Networks', 'DBMS', 'DAA', 'Software Engineering', 'Discrete Math', 'Digital Electronics'].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        if (!subjects.includes(sug)) setSubjects([...subjects, sug]);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2"
                >
                  <span>Continue to Career & Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Career Interest, Study Target & Skill Level */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Career Target & Study Habit
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Set your dream tech role and daily study pace
                  </p>
                </div>
              </div>

              {/* Target Career Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Target Career Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {careers.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCareerInterest(c)}
                      className={`text-left text-xs p-3 rounded-xl border transition-all ${
                        careerInterest === c
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Study Target (Hours) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Daily Study Target: <strong className="text-indigo-600">{dailyStudyTargetHours} hours / day</strong></span>
                  </label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={dailyStudyTargetHours}
                  onChange={(e) => setDailyStudyTargetHours(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 hr (Light)</span>
                  <span>3.5 hrs (Balanced)</span>
                  <span>8 hrs (Exam Sprint)</span>
                </div>
              </div>

              {/* Current Coding & Tech Skill Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Current Coding & Technical Skill Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {skillLevels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCurrentSkillLevel(lvl)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        currentSkillLevel === lvl
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enter CampusAI Copilot</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
