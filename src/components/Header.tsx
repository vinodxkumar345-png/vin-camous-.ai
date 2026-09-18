import React from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Flame, 
  GraduationCap, 
  FileText, 
  Code2, 
  AlarmClock, 
  Compass, 
  CheckSquare, 
  LayoutDashboard,
  User,
  Timer
} from 'lucide-react';
import { ActiveScreen } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenChatDrawer: () => void;
  isChatDrawerOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenChatDrawer,
  isChatDrawerOpen
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getScreenDetails = () => {
    switch (currentScreen) {
      case 'dashboard':
        return { title: 'Dashboard', icon: LayoutDashboard, subtitle: 'Overview & daily focus' };
      case 'study-coach':
        return { title: 'AI Study Coach', icon: GraduationCap, subtitle: 'Personalized study plans & topic breakdowns' };
      case 'notes-assistant':
        return { title: 'Notes & PDF Assistant', icon: FileText, subtitle: 'Summaries, key formulas & document Q&A' };
      case 'coding-mentor':
        return { title: 'AI Coding Mentor', icon: Code2, subtitle: 'Error explanation, step-by-step fix & exercises' };
      case 'exam-mode':
        return { title: 'Exam Mode', icon: AlarmClock, subtitle: 'Countdown, high-yield topics & flashcards' };
      case 'career-roadmap':
        return { title: 'Career Roadmap', icon: Compass, subtitle: 'Skills, projects & milestone planner' };
      case 'productivity':
        return { title: 'Tasks & Focus Timer', icon: CheckSquare, subtitle: 'Assignments, deadlines & Pomodoro' };
      case 'ai-chat':
        return { title: 'CampusAI Copilot', icon: Sparkles, subtitle: 'Your 24/7 college academic assistant' };
      case 'profile':
        return { title: 'Student Profile & Settings', icon: User, subtitle: 'College details & preferences' };
      default:
        return { title: 'CampusAI', icon: Sparkles, subtitle: 'College Copilot' };
    }
  };

  const details = getScreenDetails();
  const Icon = details.icon;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Screen Title & Info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {details.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {details.subtitle}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Indicator */}
        {user && (
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold cursor-pointer hover:scale-105 transition-transform"
            title={`${user.studyStreakDays} day study streak!`}
          >
            <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>{user.studyStreakDays}d</span>
          </div>
        )}

        {/* Quick Focus Timer Button */}
        <button
          onClick={() => onNavigate('productivity')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
          title="Open Focus Timer"
        >
          <Timer className="w-3.5 h-3.5 text-indigo-500" />
          <span>Timer</span>
        </button>

        {/* Floating CampusAI Quick Tutor Drawer Toggle */}
        <button
          onClick={onOpenChatDrawer}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm ${
            isChatDrawerOpen
              ? 'bg-indigo-700 text-white shadow-indigo-600/30'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-indigo-500/20'
          }`}
          title="Ask CampusAI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask CampusAI</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* User Avatar */}
        {user && (
          <button
            onClick={() => onNavigate('profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center hover:ring-2 hover:ring-indigo-500 transition-all shrink-0"
            title="Account Profile"
          >
            {user.name.charAt(0)}
          </button>
        )}
      </div>
    </header>
  );
};
