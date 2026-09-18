import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { api } from '../services/api';
import { initialStudentProfile } from '../data/mockData';

interface AuthContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  demoLogin: () => void;
  logout: () => void;
  updateProfile: (data: Partial<StudentProfile>) => Promise<void>;
  completeOnboarding: (data: Partial<StudentProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved student profile
    const stored = api.getStoredProfile();
    if (stored && stored.id) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await api.login(email);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = () => {
    setUser(initialStudentProfile);
    api.updateProfile(initialStudentProfile);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('campusai_profile');
    } catch {}
  };

  const updateProfile = async (data: Partial<StudentProfile>) => {
    if (!user) return;
    const updated = await api.updateProfile(data);
    setUser(updated);
  };

  const completeOnboarding = async (data: Partial<StudentProfile>) => {
    if (!user) return;
    const updated = await api.updateProfile({
      ...data,
      onboardingCompleted: true
    });
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        demoLogin,
        logout,
        updateProfile,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
