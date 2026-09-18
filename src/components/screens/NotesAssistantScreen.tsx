import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Send, 
  BookOpen, 
  CheckCircle2, 
  Loader2, 
  HelpCircle, 
  Award, 
  Layers,
  ArrowRight,
  FileCode,
  Tag
} from 'lucide-react';
import { NoteDocument } from '../../types';
import { api } from '../../services/api';

export const NotesAssistantScreen: React.FC = () => {
  const [documents, setDocuments] = useState<NoteDocument[]>(() => api.getDocuments());
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Upload modal/form
  const [docTitle, setDocTitle] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [textContent, setTextContent] = useState('');
  const [fileName, setFileName] = useState('');

  // Q&A state
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState<{ answer: string; citations: string[] } | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const currentDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!docTitle) {
      setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTextContent(content || `Content extracted from ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() && !fileName.trim()) return;

    setIsAnalyzing(true);
    try {
      const content = textContent.trim() || `Lecture notes for ${docTitle || subject}. Key points on architecture, memory allocation, and concurrency control.`;
      const newDoc = await api.analyzeDocument(docTitle, subject, content, fileName || 'Uploaded_Notes.pdf');
      setDocuments([newDoc, ...documents]);
      setSelectedDocId(newDoc.id);
      // Reset form
      setDocTitle('');
      setTextContent('');
      setFileName('');
      setQaAnswer(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaQuestion.trim() || !currentDoc || isAsking) return;

    setIsAsking(true);
    try {
      const res = await api.askDocumentQuestion(
        qaQuestion, 
        currentDoc.rawContent || currentDoc.summary, 
        currentDoc.title
      );
      setQaAnswer(res);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>AI Notes & PDF Assistant</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Upload lecture notes or textbook PDFs to summarize, extract formulas, and ask questions
          </p>
        </div>

        {/* Pre-loaded / Document Select */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium hidden sm:inline">
            Active Document:
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => {
              setSelectedDocId(e.target.value);
              setQaAnswer(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-xs truncate"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.subject})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload New Doc + Document Info */}
        <div className="lg:col-span-4 space-y-5">
          {/* Upload Card */}
          <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Upload Notes or Lecture Slides</span>
            </h3>

            <form onSubmit={handleAnalyze} className="space-y-3.5">
              {/* Drop Area */}
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group bg-slate-50/50 dark:bg-slate-800/40">
                <Upload className="w-7 h-7 text-slate-400 group-hover:text-indigo-600 transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {fileName ? fileName : 'Click or Drag PDF / Doc here'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Supports PDF, DOCX, TXT, MD
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt,.docx,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Unit 4: Computer Networks Routing"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems, Networks"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Pasted Notes / Text (Optional)
                </label>
                <textarea
                  rows={3}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste lecture notes or text directly if you don't have a file handy..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Document with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze & Extract Insights</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Library of Uploaded Docs */}
          <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
              Your College Document Library
            </h4>
            <div className="space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setQaAnswer(null);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    selectedDocId === doc.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs truncate">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{doc.subject}</span>
                      <span>•</span>
                      <span>{doc.fileSize || '1.2 MB'}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summaries, Formulas, Exam Questions & Document Q&A */}
        <div className="lg:col-span-8 space-y-5">
          {currentDoc && (
            <>
              {/* Document Header & Summary */}
              <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        {currentDoc.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentDoc.subject}</span>
                        <span>•</span>
                        <span>Uploaded {currentDoc.uploadedAt}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Executive AI Summary</span>
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {currentDoc.summary}
                  </div>
                </div>

                {/* Key Formulas & Theorems */}
                {currentDoc.keyFormulasAndTheorems && currentDoc.keyFormulasAndTheorems.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Key Formulas, Theorems & Invariants:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentDoc.keyFormulasAndTheorems.map((formula, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs font-mono text-indigo-950 dark:text-indigo-200"
                        >
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Exam Questions */}
                {currentDoc.importantExamQuestions && currentDoc.importantExamQuestions.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Probable University Exam Questions ({currentDoc.subject})</span>
                    </h4>
                    <div className="space-y-3">
                      {currentDoc.importantExamQuestions.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Q{qIdx + 1}: {q.question}
                            </span>
                            {q.marks && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                                {q.marks} Marks
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-600">
                            <strong>Key Solution Highlights:</strong> {q.answerSnippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Document Interactive Q&A */}
              <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Ask Questions About This Document
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      CampusAI provides grounded answers with specific citations from your uploaded text
                    </p>
                  </div>
                </div>

                {/* Pre-prompt quick questions */}
                <div className="flex flex-wrap gap-2">
                  {[
                    'What are the 3 mandatory conditions for critical section?',
                    'Explain difference between Counting and Binary Semaphore',
                    'How is deadlock avoided in this algorithm?'
                  ].map((quickQ, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQaQuestion(quickQ)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {quickQ}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={qaQuestion}
                    onChange={(e) => setQaQuestion(e.target.value)}
                    placeholder={`Ask a question about ${currentDoc.title}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!qaQuestion.trim() || isAsking}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Ask Doc</span>
                  </button>
                </form>

                {/* QA Result */}
                {qaAnswer && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3 animate-in fade-in duration-200">
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {qaAnswer.answer}
                    </div>

                    {qaAnswer.citations && qaAnswer.citations.length > 0 && (
                      <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-2 text-[11px] text-indigo-700 dark:text-indigo-300">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="font-semibold">References:</span>
                        <span className="italic">{qaAnswer.citations.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
