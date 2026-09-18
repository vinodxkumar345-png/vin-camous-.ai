import React, { useState } from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  AlarmClock, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ArrowRight, 
  BookOpen, 
  Code2, 
  Send, 
  Calendar,
  AlertCircle,
  Play,
  CheckSquare
} from 'lucide-react';
import { ActiveScreen, StudyPlan, ExamItem, Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface DashboardScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  onOpenTopicModal?: (plan: StudyPlan, topicId: string) => void;
  onOpenQuickChatWithPrompt?: (prompt: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenQuickChatWithPrompt
}) => {
  const { user } = useAuth();
  const [studyPlans] = useState<StudyPlan[]>(() => api.getStudyPlans());
  const [exams] = useState<ExamItem[]>(() => api.getExams());
  const [tasks, setTasks] = useState<Task[]>(() => api.getTasks());
  const [quickQuery, setQuickQuery] = useState('');

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 18) return 'Good afternoon ☀️';
    return 'Good evening 🌙';
  };

  const activePlan = studyPlans[0];
  const upcomingExam = exams[0];
  const pendingTasks = tasks.filter(t => !t.completed);

  const handleToggleTask = (id: string) => {
    const updated = api.toggleTask(id);
    setTasks(updated);
  };

  const handleAskCampusAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    if (onOpenQuickChatWithPrompt) {
      onOpenQuickChatWithPrompt(quickQuery);
      setQuickQuery('');
    } else {
      onNavigate('ai-chat');
    }
  };

  // Remaining days calculation
  const getDaysRemaining = (dateStr: string) => {
    try {
      const diff = new Date(dateStr).getTime() - Date.now();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    } catch {
      return 5;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Hero Greeting & Goal Bar */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-600/15 relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium mb-1">
            <span>{getGreeting()}</span>
            <span className="font-bold text-white">{user?.name ? user.name.split(' ')[0] : 'Student'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
            What's your goal today?
          </h2>

          <p className="text-xs sm:text-sm text-indigo-100/90 mt-2 max-w-xl">
            You're currently on a <strong>{user?.studyStreakDays || 14}-day study streak</strong>. Target today: {user?.dailyStudyTargetHours || 3.5} hours of focused learning.
          </p>

          {/* Quick AI Search/Goal Input */}
          <form 
            onSubmit={handleAskCampusAI}
            className="mt-6 flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 sm:p-2 focus-within:bg-white/25 transition-all shadow-inner"
          >
            <Sparkles className="w-5 h-5 text-indigo-200 ml-2.5 shrink-0" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Ask CampusAI anything: 'Explain Round Robin scheduling', 'Help debug my C pointer error'..."
              className="flex-1 bg-transparent border-none focus:outline-none text-xs sm:text-sm text-white placeholder-indigo-200/70 px-2"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Prompt chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              'Banker\'s Algorithm quick revision',
              'Generate 3 practice MCQs on Deadlocks',
              'How to structure my B.Tech 3rd year resume?'
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (onOpenQuickChatWithPrompt) onOpenQuickChatWithPrompt(chip);
                  else onNavigate('ai-chat');
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-indigo-100 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: 5 Core Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: Today's Study Plan */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Today's Study Plan
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activePlan ? activePlan.subject : 'Operating Systems'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('study-coach')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activePlan ? (
              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-300">
                      Current Focus Topic
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      45 mins
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    {activePlan.modules[1]?.topics[1]?.title || 'Banker\'s Algorithm for Deadlock Avoidance'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Safety sequence calculation, Allocation and Need matrices.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Progress: {activePlan.completedTopics} of {activePlan.totalTopics} topics</span>
                  <span className="font-bold text-indigo-600">
                    {Math.round((activePlan.completedTopics / activePlan.totalTopics) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${(activePlan.completedTopics / activePlan.totalTopics) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center py-6">
                <p className="text-xs text-slate-500">No active study plan found.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('study-coach')}
            className="mt-4 w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Continue Studying</span>
          </button>
        </div>

        {/* CARD 2: Upcoming Exams */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <AlarmClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Upcoming Exams
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Countdown & High-Yield Topics
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('exam-mode')}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Exam Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingExam ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {upcomingExam.subject}
                    </h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{upcomingExam.examDate}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400 leading-none block">
                      {getDaysRemaining(upcomingExam.examDate)}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Days Left
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    High-Weightage Topics to Revise:
                  </span>
                  <div className="space-y-1">
                    {upcomingExam.highWeightageTopics.slice(0, 2).map((top, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{top}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <button
            onClick={() => onNavigate('exam-mode')}
            className="mt-4 w-full py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <AlarmClock className="w-3.5 h-3.5" />
            <span>Open Revision Schedule</span>
          </button>
        </div>

        {/* CARD 3: Pending Assignments & Lab Tasks */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Pending Assignments
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {pendingTasks.length} tasks due soon
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('productivity')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {pendingTasks.slice(0, 3).map((task) => (
                <div 
                  key={task.id}
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
                  onClick={() => handleToggleTask(task.id)}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-500">{task.subject}</span>
                      <span>•</span>
                      <span className="text-rose-500 font-semibold">Due {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('productivity')}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Manage All Assignments</span>
          </button>
        </div>

        {/* CARD 4: Learning Progress Metrics */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Learning Progress
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Semester study stats
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>Streak</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {user?.studyStreakDays || 14} <span className="text-xs font-normal text-slate-400">days</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-indigo-500 text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Hours Logged</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {user?.totalStudyHours || 42.5} <span className="text-xs font-normal text-slate-400">hrs</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Topics Mastered</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {user?.topicsMasteredCount || 28} <span className="text-xs font-normal text-slate-400">topics</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-violet-500 text-xs font-semibold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Career Pace</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
                  {user?.careerInterest || 'Software Dev'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('career-roadmap')}
            className="mt-4 w-full py-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold text-xs hover:bg-violet-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Career Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 5: AI Coding Mentor Quick Access */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    AI Coding Mentor
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    C, C++, Python, Java & JavaScript
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Paste any code snippet with an error, segmentation fault, or performance bottleneck. CampusAI explains the bug in plain language and provides step-by-step corrections.
              </p>
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-hidden">
                <div className="text-emerald-400">// Ready to debug your code</div>
                <div>void reverseArray(int arr[], int size) &#123;...&#125;</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('coding-mentor')}
            className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Open Safe Code Editor</span>
          </button>
        </div>

        {/* CARD 6: PDF & Lecture Notes Assistant */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Notes & PDF Assistant
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Upload & chat with lecture docs
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p>
                Upload your semester slides or notes to get executive summaries, key formulas, and exam questions with citations.
              </p>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span className="font-medium text-xs truncate">OS_Unit3_Process_Sync_Notes.pdf</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('notes-assistant')}
            className="mt-4 w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Document Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
