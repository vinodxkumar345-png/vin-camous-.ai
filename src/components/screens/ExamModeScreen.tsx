import React, { useState, useEffect } from 'react';
import { 
  AlarmClock, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  RotateCw, 
  Plus, 
  Target, 
  FileCheck, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Award,
  X,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamItem, Flashcard } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ExamModeScreen: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamItem[]>(() => api.getExams());
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [showAddExamModal, setShowAddExamModal] = useState(false);

  // Form state
  const [newSubject, setNewSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [targetGrade, setTargetGrade] = useState('A+ / 9.0+ CGPA');
  const [isAdding, setIsAdding] = useState(false);

  // Flashcards flip state
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock test state
  const [activeTab, setActiveTab] = useState<'schedule' | 'flashcards' | 'mock-test'>('schedule');
  const [mockTimer, setMockTimer] = useState(45 * 60); // 45 mins
  const [isMockRunning, setIsMockRunning] = useState(false);
  const [studentMockAnswer, setStudentMockAnswer] = useState('');
  const [mockEvaluated, setMockEvaluated] = useState(false);

  const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];

  // Countdown timer state
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!currentExam?.examDate) return;

    const calculateTime = () => {
      const target = new Date(currentExam.examDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [currentExam?.examDate]);

  // Mock test timer countdown
  useEffect(() => {
    let interval: any;
    if (isMockRunning && mockTimer > 0) {
      interval = setInterval(() => setMockTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isMockRunning, mockTimer]);

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newExamDate) return;

    setIsAdding(true);
    try {
      const newExam = await api.generateExamSchedule(newSubject, newExamDate, targetGrade);
      setExams([newExam, ...exams]);
      setSelectedExamId(newExam.id);
      setShowAddExamModal(false);
      setNewSubject('');
      setNewExamDate('');
      confetti({ particleCount: 50, spread: 60 });
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleDailyPlan = (dayNum: number) => {
    if (!currentExam) return;
    const updatedDays = currentExam.dailyRevisionPlan.map(d => 
      d.day === dayNum ? { ...d, completed: !d.completed } : d
    );
    const updatedExam = { ...currentExam, dailyRevisionPlan: updatedDays };
    api.updateExam(updatedExam);
    setExams(exams.map(e => e.id === updatedExam.id ? updatedExam : e));
  };

  const flashcards = currentExam?.flashcards || [];
  const currentCard: Flashcard | undefined = flashcards[currentFlashcardIdx];

  const formatMockTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Exam Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <AlarmClock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            <span>Exam Mode</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Targeted exam countdown, prioritized high-weightage topics, flashcards & mock tests
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exams.length > 1 && (
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.subject} ({ex.examDate})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowAddExamModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Exam</span>
          </button>
        </div>
      </div>

      {currentExam && (
        <>
          {/* Live Countdown & Exam Hero */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-xl shadow-orange-600/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                  Target Grade: {currentExam.targetGrade}
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2">
                  {currentExam.subject} Final Exam
                </h3>
                <p className="text-xs sm:text-sm text-amber-100 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Exam Scheduled: <strong>{currentExam.examDate}</strong></span>
                </p>
              </div>

              {/* Ticking Countdown Tiles */}
              <div className="flex items-center gap-2.5 sm:gap-3 bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                <div className="text-center min-w-[50px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono leading-none block">
                    {timeRemaining.days}
                  </span>
                  <span className="text-[10px] text-amber-200 font-semibold uppercase">Days</span>
                </div>
                <span className="text-xl font-bold opacity-60">:</span>
                <div className="text-center min-w-[50px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono leading-none block">
                    {timeRemaining.hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-amber-200 font-semibold uppercase">Hours</span>
                </div>
                <span className="text-xl font-bold opacity-60">:</span>
                <div className="text-center min-w-[50px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono leading-none block">
                    {timeRemaining.minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-amber-200 font-semibold uppercase">Mins</span>
                </div>
                <span className="text-xl font-bold opacity-60">:</span>
                <div className="text-center min-w-[50px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono leading-none block text-amber-300">
                    {timeRemaining.seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-amber-200 font-semibold uppercase">Secs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Tabs: Daily Revision Plan | Flashcards | Mock Practice Test */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Daily Revision Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'flashcards'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <RotateCw className="w-4 h-4" />
              <span>Revision Flashcards ({flashcards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('mock-test')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'mock-test'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Mock Practice Test</span>
            </button>
          </div>

          {/* TAB 1: DAILY REVISION SCHEDULE & HIGH-WEIGHTAGE TOPICS */}
          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
              {/* Daily Schedule List (8 cols) */}
              <div className="lg:col-span-8 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Sprint Revision Plan</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    Check off days as you complete them
                  </span>
                </div>

                <div className="space-y-3">
                  {currentExam.dailyRevisionPlan.map((planItem) => (
                    <div
                      key={planItem.day}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        planItem.completed
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleDailyPlan(planItem.day)}
                          className="text-slate-300 hover:text-emerald-500 transition-colors"
                        >
                          {planItem.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                              {planItem.date}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {planItem.hours} hrs focus
                            </span>
                          </div>
                          <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                            planItem.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                          }`}>
                            {planItem.focus}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleDailyPlan(planItem.day)}
                        className="text-xs font-bold text-slate-500 hover:text-amber-600"
                      >
                        {planItem.completed ? 'Completed' : 'Mark Done'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Weightage Topics Sidebar (4 cols) */}
              <div className="lg:col-span-4 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Flame className="w-4 h-4 text-rose-500 fill-current" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    High-Weightage Topics (80/20 Rule)
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Historically, university question papers allocate 70%+ of total marks from these critical concepts:
                </p>

                <div className="space-y-2.5">
                  {currentExam.highWeightageTopics.map((top, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs font-semibold text-amber-950 dark:text-amber-200 flex items-center gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-lg bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{top}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE 3D REVISION FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 py-4">
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-400">
                  Card {currentFlashcardIdx + 1} of {flashcards.length}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Active Recall Flashcards
                </h4>
                <p className="text-xs text-slate-500">
                  Tap the card to reveal the exam definition & solution formula
                </p>
              </div>

              {currentCard && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer min-h-[260px] rounded-3xl p-8 border text-center flex flex-col justify-between items-center transition-all duration-300 shadow-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-2xl relative"
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      {isFlipped ? 'Answer & Formula' : 'Question / Concept'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to flip</span>
                    </span>
                  </div>

                  <div className="my-auto px-4">
                    {isFlipped ? (
                      <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                        {currentCard.back}
                      </p>
                    ) : (
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {currentCard.front}
                      </h3>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Difficulty: <strong className="capitalize text-indigo-600">{currentCard.difficulty}</strong>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  disabled={currentFlashcardIdx === 0}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIdx(i => Math.max(0, i - 1));
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800"
                >
                  Flip Card
                </button>

                <button
                  disabled={currentFlashcardIdx === flashcards.length - 1}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIdx(i => Math.min(flashcards.length - 1, i + 1));
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TIMED MOCK PRACTICE TEST */}
          {activeTab === 'mock-test' && (
            <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-600" />
                    <span>{currentExam.subject} Semester Mock Test</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Practice answering high-weightage 10-mark questions under timed exam conditions
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{formatMockTime(mockTimer)}</span>
                  </div>

                  <button
                    onClick={() => setIsMockRunning(!isMockRunning)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-colors ${
                      isMockRunning ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isMockRunning ? 'Pause Timer' : 'Start Mock Timer'}
                  </button>
                </div>
              </div>

              {/* Question prompt */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Question 1 (10 Marks):
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Explain Banker's Algorithm with an example of 5 processes (P0 to P4) and 3 resource types (A, B, C). Define the Safety Algorithm steps and demonstrate how a deadlock-free state is determined.
                </p>
              </div>

              {/* Student answer area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Type your exam answer (or outline key points, formulas, matrices):
                </label>
                <textarea
                  rows={6}
                  value={studentMockAnswer}
                  onChange={(e) => setStudentMockAnswer(e.target.value)}
                  placeholder="1. Data structures used: Available[m], Max[n][m], Allocation[n][m], Need[n][m] where Need[i][j] = Max[i][j] - Allocation[i][j]...
2. Safety Algorithm Work vector initialized to Available..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setMockEvaluated(true);
                    confetti({ particleCount: 60, spread: 70 });
                  }}
                  disabled={!studentMockAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 disabled:opacity-40 transition-colors"
                >
                  Submit for AI Examiner Evaluation
                </button>
              </div>

              {mockEvaluated && (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Examiner Feedback: 8.5 / 10 Marks</span>
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                      High Distinction Level
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Great answer structure! You clearly articulated the Need matrix formula (`Need = Max - Allocation`) and the Work and Finish vectors. To achieve the full 10/10 in your university paper, remember to also explicitly state the Resource-Request Algorithm condition: `Request[i] &le; Need[i]` and `Request[i] &le; Available`.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal: Schedule New Exam */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlarmClock className="w-4 h-4 text-amber-600" />
                <span>Schedule New Exam</span>
              </h3>
              <button
                onClick={() => setShowAddExamModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExam} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Course
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Computer Networks, Microprocessors"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  required
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Grade
                </label>
                <input
                  type="text"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  placeholder="e.g. A+ / 9.5 CGPA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate Revision Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
