import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  Code2, 
  AlarmClock, 
  Compass, 
  CheckSquare, 
  Bot, 
  User, 
  Flame, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { ActiveScreen } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  collapsed,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '' },
    { id: 'study-coach', label: 'AI Study Coach', icon: GraduationCap, badge: 'AI' },
    { id: 'notes-assistant', label: 'Notes & PDFs', icon: FileText, badge: 'AI' },
    { id: 'coding-mentor', label: 'Coding Mentor', icon: Code2, badge: 'AI' },
    { id: 'exam-mode', label: 'Exam Mode', icon: AlarmClock, badge: 'Hot' },
    { id: 'career-roadmap', label: 'Career Roadmap', icon: Compass, badge: '' },
    { id: 'productivity', label: 'Tasks & Timer', icon: CheckSquare, badge: '' },
    { id: 'ai-chat', label: 'CampusAI Tutor', icon: Bot, badge: 'Pro' },
    { id: 'profile', label: 'Profile & Settings', icon: User, badge: '' },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        {!collapsed && (
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                Campus<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase block -mt-1">
                College Copilot
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div 
            onClick={() => onNavigate('dashboard')}
            className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white cursor-pointer shadow-md shadow-indigo-500/20"
            title="CampusAI"
          >
            <Sparkles className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Streak & College Badge */}
      {!collapsed && user && (
        <div className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user.studyStreakDays} Day Streak
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {user.totalStudyHours} hrs logged
                </div>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              {user.year}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ActiveScreen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-110'}`} />
              
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : item.badge === 'AI' 
                    ? 'bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-300'
                    : item.badge === 'Hot'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {user && !collapsed && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div 
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user.branch.split('(')[0]}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {user && collapsed && (
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
            title={user.name}
          >
            {user.name.charAt(0)}
          </button>
        )}
      </div>
    </aside>
  );
};
