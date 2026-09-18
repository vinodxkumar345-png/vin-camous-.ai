import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckSquare, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Volume2, 
  VolumeX, 
  Flame, 
  Clock, 
  Tag, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, TaskPriority, TaskCategory } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ProductivityScreen: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => api.getTasks());
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(user?.subjects?.[0] || 'Operating Systems');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('assignment');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Pomodoro timer state
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'deep' | 'break'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessionsToday, setCompletedSessionsToday] = useState(2);

  // Web Audio Synth for Ambient Sound
  const [ambientSound, setAmbientSound] = useState<'none' | 'white' | 'rain' | 'alpha'>('none');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Timer intervals
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      confetti({ particleCount: 80, spread: 70 });
      setCompletedSessionsToday(c => c + 1);
      if (user) {
        updateProfile({ totalStudyHours: Number(((user.totalStudyHours || 0) + 0.5).toFixed(1)) });
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, user, updateProfile]);

  const setTimerPreset = (mode: 'pomodoro' | 'deep' | 'break') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    else if (mode === 'deep') setTimeLeft(50 * 60);
    else if (mode === 'break') setTimeLeft(5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ambient sound synthesis using Web Audio API
  const toggleAmbientSound = (sound: 'none' | 'white' | 'rain' | 'alpha') => {
    if (ambientSound === sound || sound === 'none') {
      stopAmbientSound();
      setAmbientSound('none');
      return;
    }

    stopAmbientSound();
    setAmbientSound(sound);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (sound === 'white' || sound === 'rain') {
        // Buffer source with noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = sound === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = sound === 'rain' ? 800 : 1000;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.05; // gentle volume

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start();
        noiseNodeRef.current = noise;
      } else if (sound === 'alpha') {
        // Binaural alpha sine tone (200Hz + 210Hz = 10Hz beat)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.frequency.value = 200;
        osc2.frequency.value = 210;

        const gain = ctx.createGain();
        gain.gain.value = 0.04;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        noiseNodeRef.current = osc1;
      }
    } catch (e) {
      console.warn('Web Audio Ambient error:', e);
    }
  };

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop?.();
      } catch {}
      noiseNodeRef.current = null;
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = api.addTask({
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || 'This week',
      completed: false
    });

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  const handleToggleTask = (id: string) => {
    const updated = api.toggleTask(id);
    setTasks(updated);
    const completedTask = updated.find(t => t.id === id);
    if (completedTask?.completed) {
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const handleDeleteTask = (id: string) => {
    const updated = api.deleteTask(id);
    setTasks(updated);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'pending' && t.completed) return false;
    if (activeFilter === 'completed' && !t.completed) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <CheckSquare className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <span>Tasks, Assignments & Focus Timer</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage academic deadlines, lab submissions, and study with Pomodoro & ambient soundscapes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Focus Timer & Ambient Sound (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl p-6 bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white border border-slate-800 shadow-xl space-y-6 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-indigo-400" />
                <span>Study Focus Timer</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {completedSessionsToday} sessions completed today
              </span>
            </div>

            {/* Presets */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setTimerPreset('pomodoro')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  timerMode === 'pomodoro'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                Pomodoro (25m)
              </button>
              <button
                onClick={() => setTimerPreset('deep')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  timerMode === 'deep'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                Deep Work (50m)
              </button>
              <button
                onClick={() => setTimerPreset('break')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  timerMode === 'break'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                Break (5m)
              </button>
            </div>

            {/* Huge Timer Clock */}
            <div className="my-4">
              <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white block">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs text-indigo-200/70 mt-1 block">
                {isTimerRunning ? 'Deep Focus Session Active' : 'Ready to Start'}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-7 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
                  isTimerRunning
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => setTimerPreset(timerMode)}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Ambient Soundscape Player */}
            <div className="pt-4 border-t border-white/10 text-left">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Focus Audio Synthesizer:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'white', label: 'White Noise' },
                  { id: 'rain', label: 'Rain Drops' },
                  { id: 'alpha', label: 'Alpha 10Hz' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleAmbientSound(s.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      ambientSound === s.id
                        ? 'bg-indigo-500 text-white font-bold'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {ambientSound === s.id ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: College Tasks & Assignment List (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Add Task Form Card */}
          <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add Academic Task or Assignment</span>
            </h3>

            <form onSubmit={handleAddTask} className="space-y-3">
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. OS Lab 4: Dining Philosophers Solution"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    placeholder="Operating Systems"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="lab">Lab Submission</option>
                    <option value="project">Project Work</option>
                    <option value="revision">Revision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <input
                  type="text"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  placeholder="Due date: e.g. Friday 5 PM"
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white max-w-xs"
                />

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>

          {/* Task List Card */}
          <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-2">
                {(['pending', 'completed', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                      activeFilter === filter
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">
                {filteredTasks.length} tasks
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No tasks found in this view.
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <p className={`text-xs sm:text-sm font-semibold truncate ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span className="font-semibold text-slate-500">{task.subject}</span>
                          <span>•</span>
                          <span className="capitalize">{task.category}</span>
                          <span>•</span>
                          <span className={`font-semibold ${
                            task.priority === 'high' ? 'text-rose-500' : task.priority === 'medium' ? 'text-amber-500' : 'text-slate-400'
                          }`}>
                            {task.priority} priority
                          </span>
                          {task.dueDate && (
                            <>
                              <span>•</span>
                              <span className="text-rose-600 font-medium">Due {task.dueDate}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
