import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ActiveScreen } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { AIChatDrawer } from './components/AIChatDrawer';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { StudyCoachScreen } from './components/screens/StudyCoachScreen';
import { NotesAssistantScreen } from './components/screens/NotesAssistantScreen';
import { CodingMentorScreen } from './components/screens/CodingMentorScreen';
import { ExamModeScreen } from './components/screens/ExamModeScreen';
import { CareerRoadmapScreen } from './components/screens/CareerRoadmapScreen';
import { ProductivityScreen } from './components/screens/ProductivityScreen';
import { AIChatScreen } from './components/screens/AIChatScreen';
import { ProfileSettingsScreen } from './components/screens/ProfileSettingsScreen';

function MainApp() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [quickChatPrompt, setQuickChatPrompt] = useState<string | undefined>(undefined);

  // If loading local state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // If not authenticated: show Splash or Auth screen
  if (!isAuthenticated) {
    if (showOnboarding) {
      return (
        <OnboardingScreen 
          onComplete={() => {
            setShowOnboarding(false);
            setCurrentScreen('dashboard');
          }} 
        />
      );
    }
    if (showAuthScreen) {
      return (
        <AuthScreen
          onSuccess={() => setShowAuthScreen(false)}
          onStartOnboarding={() => {
            setShowAuthScreen(false);
            setShowOnboarding(true);
          }}
        />
      );
    }
    return (
      <SplashScreen
        onGetStarted={() => setShowOnboarding(true)}
        onLoginClick={() => setShowAuthScreen(true)}
      />
    );
  }

  // If authenticated but hasn't completed onboarding
  if (user && !user.onboardingCompleted) {
    return (
      <OnboardingScreen 
        onComplete={() => {
          setCurrentScreen('dashboard');
        }} 
      />
    );
  }

  const handleOpenQuickChatWithPrompt = (prompt: string) => {
    setQuickChatPrompt(prompt);
    setCurrentScreen('ai-chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      <div className="flex-1 flex w-full">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
          {/* Top Header */}
          <Header
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenChatDrawer={() => setIsChatDrawerOpen(true)}
            isChatDrawerOpen={isChatDrawerOpen}
          />

          {/* Active Screen View */}
          <main className="flex-1 overflow-y-auto">
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                onNavigate={(screen) => setCurrentScreen(screen)}
                onOpenQuickChatWithPrompt={handleOpenQuickChatWithPrompt}
              />
            )}

            {currentScreen === 'study-coach' && <StudyCoachScreen />}

            {currentScreen === 'notes-assistant' && <NotesAssistantScreen />}

            {currentScreen === 'coding-mentor' && <CodingMentorScreen />}

            {currentScreen === 'exam-mode' && <ExamModeScreen />}

            {currentScreen === 'career-roadmap' && <CareerRoadmapScreen />}

            {currentScreen === 'productivity' && <ProductivityScreen />}

            {currentScreen === 'ai-chat' && (
              <AIChatScreen initialQuery={quickChatPrompt} />
            )}

            {currentScreen === 'profile' && <ProfileSettingsScreen />}
          </main>
        </div>
      </div>

      {/* Global Quick AI Tutor Drawer (accessible from ANY screen) */}
      <AIChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        onNavigateToFullChat={() => setCurrentScreen('ai-chat')}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
