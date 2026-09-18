import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  ChevronRight, 
  Plus, 
  Loader2, 
  BookOpen, 
  Lightbulb, 
  Layers,
  Award,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyPlan, StudyTopic, QuizQuestion } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const StudyCoachScreen: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>(() => api.getStudyPlans());
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  // Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState(user?.subjects?.[0] || 'Operating Systems');
  const [topicOrFocus, setTopicOrFocus] = useState('Process Scheduling & Deadlocks');
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString().split('T')[0]
  );
  const [dailyHours, setDailyHours] = useState(user?.dailyStudyTargetHours || 3);
  const [isGenerating, setIsGenerating] = useState(false);

  // Topic Explainer Modal State
  const [explainingTopic, setExplainingTopic] = useState<StudyTopic | null>(null);
  const [explanationData, setExplanationData] = useState<{
    simpleExplanation: string;
    realLifeAnalogy: string;
    examKeyPoints: string[];
    quizQuestions: QuizQuestion[];
  } | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  // Quiz state inside Explainer Modal
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const currentPlan = plans[selectedPlanIndex] || plans[0];

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topicOrFocus.trim()) return;

    setIsGenerating(true);
    try {
      const newPlan = await api.generateStudyPlan(subject, topicOrFocus, examDate, dailyHours);
      setPlans([newPlan, ...plans]);
      setSelectedPlanIndex(0);
      setShowCreateModal(false);
      confetti({ particleCount: 50, spread: 60 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTopic = (topicId: string) => {
    if (!currentPlan) return;

    let newlyCompletedCount = 0;
    const updatedModules = currentPlan.modules.map(mod => ({
      ...mod,
      topics: mod.topics.map(top => {
        if (top.id === topicId) {
          const nextStatus = top.status === 'completed' ? 'not-started' : 'completed';
          if (nextStatus === 'completed') newlyCompletedCount++;
          return { ...top, status: nextStatus as 'completed' | 'not-started' };
        }
        return top;
      })
    }));

    // Calculate total completed
    let totalCompleted = 0;
    updatedModules.forEach(m => m.topics.forEach(t => {
      if (t.status === 'completed') totalCompleted++;
    }));

    const updatedPlan: StudyPlan = {
      ...currentPlan,
      modules: updatedModules,
      completedTopics: totalCompleted
    };

    api.updateStudyPlan(updatedPlan);
    const newPlans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    setPlans(newPlans);

    if (totalCompleted === currentPlan.totalTopics) {
      confetti({ particleCount: 100, spread: 80 });
    }

    if (newlyCompletedCount > 0 && user) {
      updateProfile({ topicsMasteredCount: (user.topicsMasteredCount || 0) + 1 });
    }
  };

  const handleOpenExplainer = async (topic: StudyTopic) => {
    setExplainingTopic(topic);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setLoadingExplanation(true);

    try {
      const res = await api.explainTopic(topic.title, currentPlan.subject);
      setExplanationData(res);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleSelectQuizAnswer = (questionId: string, optionIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    setSubmittedQuiz(true);
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>AI Study Coach</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Personalized curriculum plans, beginner analogies, and practice quizzes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Plan Selector */}
          {plans.length > 1 && (
            <select
              value={selectedPlanIndex}
              onChange={(e) => setSelectedPlanIndex(parseInt(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              {plans.map((p, idx) => (
                <option key={p.id} value={idx}>
                  {p.subject} ({Math.round((p.completedTopics / p.totalTopics) * 100)}%)
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Plan</span>
          </button>
        </div>
      </div>

      {/* Active Study Plan Overview Card */}
      {currentPlan && (
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
                  {currentPlan.subject}
                </span>
                {currentPlan.examDate && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Exam: {currentPlan.examDate}</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {currentPlan.topicOrFocus}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{currentPlan.dailyHours} hours / day</span>
                </span>
                <span>•</span>
                <span>{currentPlan.totalTopics} total topics</span>
              </p>
            </div>

            {/* Progress Gauge */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                <div 
                  className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin-slow"
                  style={{ transform: `rotate(${Math.round((currentPlan.completedTopics / currentPlan.totalTopics) * 360)}deg)` }}
                />
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {Math.round((currentPlan.completedTopics / currentPlan.totalTopics) * 100)}%
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {currentPlan.completedTopics} of {currentPlan.totalTopics} Topics Completed
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {currentPlan.totalTopics - currentPlan.completedTopics === 0 
                    ? '🎉 Plan Fully Mastered!' 
                    : `${currentPlan.totalTopics - currentPlan.completedTopics} topics remaining`}
                </div>
              </div>
            </div>
          </div>

          {/* Revision Tips Banner */}
          {currentPlan.revisionTips && currentPlan.revisionTips.length > 0 && (
            <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>AI Exam Tips for this Subject:</span>
              </span>
              <ul className="text-xs text-amber-900/80 dark:text-amber-200/80 space-y-1 list-disc list-inside">
                {currentPlan.revisionTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Modules & Topics Timeline */}
          <div className="mt-8 space-y-6">
            {currentPlan.modules.map((module, mIdx) => (
              <div key={module.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {mIdx + 1}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {module.moduleName}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Estimated {module.estimatedDays} days
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pl-8 border-l-2 border-slate-100 dark:border-slate-800 ml-3">
                  {module.topics.map((topic) => {
                    const isDone = topic.status === 'completed';
                    return (
                      <div
                        key={topic.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDone
                            ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-500'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleTopic(topic.id)}
                            className="mt-0.5 text-slate-300 hover:text-indigo-600 transition-colors shrink-0"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className={`font-bold text-xs sm:text-sm ${
                                isDone 
                                  ? 'line-through text-slate-400' 
                                  : 'text-slate-900 dark:text-white'
                              }`}>
                                {topic.title}
                              </h5>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                                {topic.estimatedMinutes}m
                              </span>
                            </div>
                            {topic.summary && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                {topic.summary}
                              </p>
                            )}
                            {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {topic.keyConcepts.map((concept, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300"
                                  >
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleOpenExplainer(topic)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-100 dark:border-indigo-900/50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Explain & Quiz</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Create New Study Plan */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Generate Personalized Study Plan
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Course
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems, Computer Networks, DBMS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic or Syllabus Focus
                </label>
                <input
                  type="text"
                  required
                  value={topicOrFocus}
                  onChange={(e) => setTopicOrFocus(e.target.value)}
                  placeholder="e.g. Memory Management, Virtual Memory, Paging"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Study Hours ({dailyHours} hrs)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 mt-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Plan with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Create AI Study Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Topic Explainer & Interactive Quiz */}
      {explainingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 relative">
            <button
              onClick={() => setExplainingTopic(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                CampusAI Explainer & Quiz
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {explainingTopic.title}
            </h3>

            {loadingExplanation ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                <p className="text-xs text-slate-500">
                  CampusAI is distilling this topic into intuitive explanations and quizzes...
                </p>
              </div>
            ) : explanationData ? (
              <div className="mt-5 space-y-5">
                {/* Intuitive Explanation */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                  <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Beginner-Friendly Explanation</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {explanationData.simpleExplanation}
                  </p>
                </div>

                {/* Real-Life Analogy */}
                {explanationData.realLifeAnalogy && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Everyday Analogy</span>
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                      "{explanationData.realLifeAnalogy}"
                    </p>
                  </div>
                )}

                {/* Exam Key Points */}
                {explanationData.examKeyPoints && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                      Points to write in your Semester Exam Answer:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {explanationData.examKeyPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practice Quiz */}
                {explanationData.quizQuestions && explanationData.quizQuestions.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>Quick Practice Quiz (Check your understanding)</span>
                    </h4>

                    <div className="space-y-4">
                      {explanationData.quizQuestions.map((q, qIdx) => (
                        <div key={q.id || qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                          <p className="text-xs font-bold text-slate-900 dark:text-white mb-2.5">
                            Q{qIdx + 1}: {q.question}
                          </p>

                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedAnswers[q.id || String(qIdx)] === optIdx;
                              const isCorrect = q.correctIndex === optIdx;
                              
                              let btnClass = 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-indigo-50/50';
                              if (isSelected) {
                                btnClass = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                              }
                              if (submittedQuiz) {
                                if (isCorrect) {
                                  btnClass = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  btnClass = 'bg-rose-600 text-white border-rose-600 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectQuizAnswer(q.id || String(qIdx), optIdx)}
                                  className={`w-full text-left text-xs p-2.5 rounded-xl border transition-all flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {submittedQuiz && isCorrect && <span>✓ Correct</span>}
                                </button>
                              );
                            })}
                          </div>

                          {submittedQuiz && (
                            <p className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                              <strong>Explanation:</strong> {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {!submittedQuiz && (
                      <button
                        onClick={handleSubmitQuiz}
                        className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        Submit Answers & Verify
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
