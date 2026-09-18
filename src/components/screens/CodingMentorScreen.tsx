import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  RotateCcw, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen,
  ArrowRight,
  Lightbulb,
  Clock,
  Cpu
} from 'lucide-react';
import { SupportedLanguage, CodeAnalysisResult, CodingExercise } from '../../types';
import { sampleCodeSnippets } from '../../data/mockData';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CodingMentorScreen: React.FC = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<SupportedLanguage>('cpp');
  const [code, setCode] = useState<string>(sampleCodeSnippets['cpp']);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Practice exercises list
  const [activeExercise, setActiveExercise] = useState<CodingExercise | null>(null);

  const languages: { id: SupportedLanguage; label: string }[] = [
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'javascript', label: 'JavaScript' },
  ];

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setCode(sampleCodeSnippets[newLang] || '// Write your code here');
    setConsoleOutput('');
    setAnalysisResult(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput('Compiling and running...');

    try {
      // Safe execution
      if (language === 'javascript') {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        const startTime = performance.now();
        try {
          const runFn = new Function(code);
          runFn();
          const duration = (performance.now() - startTime).toFixed(2);
          setExecutionTime(`${duration}ms`);
          setConsoleOutput(logs.length > 0 ? logs.join('\n') : 'Program finished with return code 0 (No output printed).');
        } catch (err: any) {
          setConsoleOutput(`Runtime Error: ${err.message}`);
        } finally {
          console.log = originalLog;
        }
      } else {
        const res = await api.executeCode(language, code);
        setConsoleOutput(res.output);
        setExecutionTime(res.executionTime);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await api.analyzeCode(language, code);
      setAnalysisResult(result);
      if (result.practiceExercise) {
        setActiveExercise(result.practiceExercise);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyCorrected = () => {
    if (!analysisResult?.correctedCode) return;
    navigator.clipboard.writeText(analysisResult.correctedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCorrected = () => {
    if (!analysisResult?.correctedCode) return;
    setCode(analysisResult.correctedCode);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>AI Coding Mentor</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Supported: C, C++, Python, Java & JavaScript • Plain-language error explanations & Big-O complexity
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                language === lang.id
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor + Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            {/* Editor Action Bar */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(sampleCodeSnippets[language] || '')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
                  title="Reset to Sample Buggy Snippet"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />}
                  <span>Run</span>
                </button>

                <button
                  onClick={handleAnalyzeCode}
                  disabled={isAnalyzing}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Debug & Explain</span>
                </button>
              </div>
            </div>

            {/* Code Textarea with line numbers */}
            <div className="relative p-4 font-mono text-xs leading-relaxed min-h-[320px] bg-slate-900 flex">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder="// Type or paste your college code here..."
                className="w-full h-80 bg-transparent text-slate-100 resize-y focus:outline-none font-mono selection:bg-indigo-500/30 leading-relaxed"
              />
            </div>

            {/* Terminal Console Output */}
            <div className="border-t border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Output Console</span>
                </div>
                {executionTime && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Executed in {executionTime}
                  </span>
                )}
              </div>
              <pre className="text-xs font-mono text-emerald-400/90 whitespace-pre-wrap min-h-16 max-h-40 overflow-y-auto bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                {consoleOutput || 'Click "Run" or "Debug & Explain" to execute or diagnose errors...'}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis, Step-by-Step Fix, Complexity & Exercise (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {analysisResult ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Diagnosis Header Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {analysisResult.hasError ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{analysisResult.errorType || 'Syntax / Logic Bug'}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Code Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Big-O Badges */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold" title="Time Complexity">
                      Time: {analysisResult.timeComplexity}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold" title="Space Complexity">
                      Space: {analysisResult.spaceComplexity}
                    </span>
                  </div>
                </div>

                {/* Plain Words Explanation */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                    Plain-Language Explanation:
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {analysisResult.simpleExplanation}
                  </p>
                </div>

                {/* Step-by-Step Corrections */}
                {analysisResult.stepByStepCorrection && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
                      Step-by-Step Fix:
                    </h4>
                    <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
                      {analysisResult.stepByStepCorrection.map((step, idx) => (
                        <li key={idx} className="leading-normal">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Corrected Code Card */}
              {analysisResult.correctedCode && (
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Optimized & Corrected Solution</span>
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleApplyCorrected}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        Apply to Editor
                      </button>
                      <button
                        onClick={handleCopyCorrected}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Copy Code"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <pre className="p-3 rounded-2xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
                    {analysisResult.correctedCode}
                  </pre>
                </div>
              )}

              {/* Practice Exercise Card */}
              {activeExercise && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-violet-50/70 dark:from-indigo-950/30 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-900/40 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Recommended Practice Exercise</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                      {activeExercise.difficulty}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {activeExercise.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {activeExercise.description}
                  </p>

                  {activeExercise.solutionHint && (
                    <p className="text-[11px] text-indigo-900/80 dark:text-indigo-200/80 italic bg-white/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                      💡 <strong>Hint:</strong> {activeExercise.solutionHint}
                    </p>
                  )}

                  <button
                    onClick={() => {
                      if (activeExercise.starterCode) {
                        setCode(activeExercise.starterCode);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Load Exercise into Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Empty State / Helpful Guidance */
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Ready to Debug & Explain
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Click <strong>"Debug & Explain"</strong> to analyze your code with CampusAI. Get instant identification of segfaults, off-by-one errors, and Big-O runtime.
                </p>
              </div>

              <div className="pt-2 text-left space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick bug recipes to test:
                </span>
                <button
                  onClick={() => {
                    handleLanguageChange('cpp');
                    setCode(sampleCodeSnippets['cpp']);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  ⚡ C++: Fix Segmentation Fault (Buffer Overflow)
                </button>
                <button
                  onClick={() => {
                    handleLanguageChange('c');
                    setCode(sampleCodeSnippets['c']);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  ⚡ C: Pointer Dereferencing and Memory Leak
                </button>
                <button
                  onClick={() => {
                    handleLanguageChange('python');
                    setCode(sampleCodeSnippets['python']);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  ⚡ Python: Inefficient Recursion & Memoization
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
