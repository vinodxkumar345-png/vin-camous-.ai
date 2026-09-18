import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  CheckCircle2, 
  Circle, 
  FolderGit2, 
  FileText, 
  Star, 
  ArrowRight,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { CareerRoadmap, CareerRole, EngineeringBranch, AcademicYear } from '../../types';
import { sampleCareerRoadmaps } from '../../data/mockData';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CareerRoadmapScreen: React.FC = () => {
  const { user } = useAuth();

  const [careerRole, setCareerRole] = useState<CareerRole>(
    (user?.careerInterest as CareerRole) || 'Software Developer'
  );
  const [branch, setBranch] = useState<EngineeringBranch>(
    user?.branch || 'Computer Science & Engg (CSE)'
  );
  const [year, setYear] = useState<AcademicYear>(user?.year || '3rd Year');
  const [roadmap, setRoadmap] = useState<CareerRoadmap>(
    sampleCareerRoadmaps[careerRole] || sampleCareerRoadmaps['Software Developer']
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Checked milestones
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    'y1_m1': true,
    'y1_m2': true,
    'y2_m1': true
  });

  const roles: CareerRole[] = [
    'Software Developer',
    'AI/ML Engineer',
    'Semiconductor / VLSI Engineer',
    'Embedded Systems Engineer',
    'Data Analyst',
    'Cloud & DevOps Engineer'
  ];

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateCareerRoadmap(branch, year, careerRole);
      setRoadmap(res);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleMilestone = (mId: string) => {
    setCompletedMilestones(prev => ({
      ...prev,
      [mId]: !prev[mId]
    }));
  };

  const skillsList = roadmap.topSkillsToLearn || roadmap.resumeKeySkills || [
    'Data Structures & Algorithms',
    'System Design',
    'SQL Databases',
    'Cloud Fundamentals'
  ];

  const yearBreakdown = roadmap.yearBreakdown || [
    {
      year: 1,
      title: 'Programming Foundations',
      focusArea: 'C / C++, Data Types, Logic Building',
      milestones: [
        'Master loops, pointers and memory allocation',
        'Learn Git and GitHub workflow',
        'Solve 50 easy coding problems'
      ]
    },
    {
      year: 2,
      title: 'Core Computer Science & DSA',
      focusArea: 'Data Structures, OS, DBMS, Networks',
      milestones: [
        'Implement Linked Lists, Trees, and Graphs from scratch',
        'Study Operating Systems and DBMS concurrency',
        'Build a full-stack CRUD application'
      ]
    },
    {
      year: 3,
      title: 'Production Projects & Internships',
      focusArea: 'Frameworks, Distributed Systems, Open Source',
      milestones: [
        'Build 2 resume-grade portfolio projects',
        'Solve 150+ LeetCode Medium questions',
        'Apply for summer internships and hackathons'
      ]
    },
    {
      year: 4,
      title: 'Campus Placements & Interview Sprints',
      focusArea: 'Mock Interviews, HR Rounds, System Design',
      milestones: [
        'Daily revision of High-Weightage core subjects',
        'System design basics and trade-offs',
        'Participate in on-campus placement drives'
      ]
    }
  ];

  const recommendedProjectsList = roadmap.recommendedProjects || [
    {
      title: 'High-Throughput Task Queue & Worker System',
      description: 'Distributed message queue with Redis and Node.js workers processing background jobs.',
      techStack: ['Node.js', 'Redis', 'Docker', 'PostgreSQL'],
      difficulty: 'Intermediate',
      githubHighlight: 'Star candidate for backend engineering roles'
    },
    {
      title: 'Real-Time Collaborative Code Playground',
      description: 'Multiplayer code editor with WebSockets, syntax highlighting and sandboxed compilation.',
      techStack: ['React', 'WebSockets', 'TypeScript', 'Tailwind'],
      difficulty: 'Advanced',
      githubHighlight: 'Demonstrates full-stack and networking depth'
    }
  ];

  const resumeTipsList = roadmap.resumeTips || [
    'Use standard single-column ATS format (avoid double columns or graphic skill meters).',
    'Quantify every project bullet: "Optimized SQL queries reducing latency by 45%".',
    'Include live deployment links and clean GitHub repositories with README documentation.',
    'Highlight coursework: Data Structures, Operating Systems, DBMS, Computer Networks.'
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Career Roadmap Generator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Year-wise college milestones, resume-worthy project blueprints, and campus placement prep
          </p>
        </div>
      </div>

      {/* Role & Engineering Branch Filter Card */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Career Role
            </label>
            <select
              value={careerRole}
              onChange={(e) => setCareerRole(e.target.value as CareerRole)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Engineering Branch
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value as EngineeringBranch)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Academic Year
            </label>
            <div className="flex gap-2">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as AcademicYear)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <button
                onClick={handleGenerateRoadmap}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Overview Hero */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white shadow-xl shadow-indigo-700/15">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              {roadmap.targetRole} Roadmap
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              4-Year College Strategy for {roadmap.targetRole}
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 mt-2 leading-relaxed">
              Step-by-step technical progression designed for university students to secure top engineering internships and final placement offers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:max-w-md">
            {skillsList.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-xs font-medium text-white border border-white/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Year-Wise Milestone Timeline */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Year-by-Year Academic & Skill Progression</span>
          </h4>
          <span className="text-xs text-slate-400">
            Check off milestones as you achieve them
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {yearBreakdown.map((yr) => {
            const isCurrentYear = user?.year?.includes(String(yr.year));
            return (
              <div
                key={yr.year}
                className={`p-5 rounded-3xl border transition-all ${
                  isCurrentYear
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      Y{yr.year}
                    </span>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        Year {yr.year}: {yr.title}
                      </h5>
                      <span className="text-[11px] text-slate-500">{yr.focusArea}</span>
                    </div>
                  </div>

                  {isCurrentYear && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase tracking-wider">
                      Current Year
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  {yr.milestones.map((m, mIdx) => {
                    const mKey = `y${yr.year}_m${mIdx}`;
                    const isChecked = !!completedMilestones[mKey];
                    return (
                      <div
                        key={mIdx}
                        onClick={() => handleToggleMilestone(mKey)}
                        className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                        <span className={`text-xs ${
                          isChecked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                        }`}>
                          {m}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Portfolio Projects & Placement Tips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Projects (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              Resume-Worthy Project Recommendations
            </h4>
          </div>

          <div className="space-y-4">
            {recommendedProjectsList.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    {proj.title}
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                    {proj.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {proj.githubHighlight && (
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-amber-500" />
                      <span>{proj.githubHighlight}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placement & Resume Tips (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              Campus Placement & Resume Tips
            </h4>
          </div>

          <div className="space-y-3">
            {resumeTipsList.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1">
              Campus Placement Pro-Tip:
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              For tech companies visiting your campus, the combination of <strong>100+ LeetCode problems (Medium)</strong> + <strong>1 deployment project with live URL</strong> puts you in the top 5% of candidates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
