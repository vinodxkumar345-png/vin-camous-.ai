import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  Code2, 
  MoreHorizontal,
  AlarmClock,
  Compass,
  CheckSquare,
  Bot,
  User,
  X
} from 'lucide-react';
import { ActiveScreen } from '../types';

interface MobileNavProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentScreen, onNavigate }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'study-coach', label: 'Coach', icon: GraduationCap },
    { id: 'notes-assistant', label: 'Notes', icon: FileText },
    { id: 'coding-mentor', label: 'Code', icon: Code2 },
  ];

  const moreTabs = [
    { id: 'exam-mode', label: 'Exam Mode', icon: AlarmClock, desc: 'Countdown & flashcards' },
    { id: 'career-roadmap', label: 'Career Roadmap', icon: Compass, desc: 'Engineering skill milestones' },
    { id: 'productivity', label: 'Tasks & Focus Timer', icon: CheckSquare, desc: 'Assignments & Pomodoro' },
    { id: 'ai-chat', label: 'CampusAI Copilot', icon: Bot, desc: '24/7 student mentor' },
    { id: 'profile', label: 'Profile & Settings', icon: User, desc: 'College details & theme' },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 px-2 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setShowMoreMenu(false);
                onNavigate(tab.id as ActiveScreen);
              }}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            showMoreMenu || ['exam-mode', 'career-roadmap', 'productivity', 'ai-chat', 'profile'].includes(currentScreen)
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* More Menu Modal / Bottom Sheet */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 pb-20 shadow-2xl z-50">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-base text-slate-900 dark:text-white">
                All CampusAI Tools
              </span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-4">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowMoreMenu(false);
                      onNavigate(item.id as ActiveScreen);
                    }}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-xs text-slate-400 truncate">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
