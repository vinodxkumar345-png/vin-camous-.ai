export type DegreeType = 'B.Tech / B.E.' | 'B.Sc' | 'BCA' | 'M.Tech / M.S.' | 'MCA' | 'Other';

export type EngineeringBranch = 
  | 'Computer Science & Engg (CSE)'
  | 'Information Technology (IT)'
  | 'Electronics & Communication (ECE)'
  | 'Electrical & Electronics (EEE)'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Data Science & AI'
  | 'Biotechnology'
  | 'Chemical Engineering'
  | 'Other';

export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export type CareerRole = 
  | 'Software Developer'
  | 'AI/ML Engineer'
  | 'Data Analyst'
  | 'Semiconductor / VLSI Engineer'
  | 'Embedded Systems Engineer'
  | 'Cloud & DevOps Engineer'
  | 'Cybersecurity Specialist'
  | 'Product / Tech Consultant';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: DegreeType;
  branch: EngineeringBranch;
  year: AcademicYear;
  subjects: string[];
  careerInterest: CareerRole;
  dailyStudyTargetHours: number;
  currentSkillLevel: SkillLevel;
  avatarUrl?: string;
  onboardingCompleted: boolean;
  studyStreakDays: number;
  totalStudyHours: number;
  topicsMasteredCount: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  estimatedMinutes: number;
  status: 'not-started' | 'in-progress' | 'completed';
  summary?: string;
  keyConcepts?: string[];
  analogy?: string;
  practiceQuestions?: QuizQuestion[];
}

export interface StudyModule {
  id: string;
  moduleName: string;
  estimatedDays: number;
  topics: StudyTopic[];
}

export interface StudyPlan {
  id: string;
  subject: string;
  topicOrFocus: string;
  examDate?: string;
  dailyHours: number;
  createdAt: string;
  totalTopics: number;
  completedTopics: number;
  modules: StudyModule[];
  revisionTips: string[];
}

export interface NoteDocument {
  id: string;
  title: string;
  subject: string;
  uploadedAt: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'notes';
  fileName: string;
  fileSize: string;
  rawContent: string;
  summary: string;
  keyFormulasAndTheorems: string[];
  importantExamQuestions: {
    question: string;
    marks: number;
    answerSnippet: string;
  }[];
  tags: string[];
}

export type SupportedLanguage = 'c' | 'cpp' | 'python' | 'java' | 'javascript';

export interface CodeExercise {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  solutionHint: string;
  testCases: { input: string; expectedOutput: string }[];
}

export type CodingExercise = CodeExercise;

export interface CodeAnalysisResult {
  hasError: boolean;
  errorType?: 'Syntax Error' | 'Logical Error' | 'Runtime Error' | 'Performance Issue' | 'Code Style';
  simpleExplanation: string;
  stepByStepCorrection: string[];
  correctedCode: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  bestPractices: string[];
  practiceExercise?: CodeExercise;
}

export interface Flashcard {
  id: string;
  front: string; // Concept or Question or Formula Name
  back: string;  // Detailed explanation or derivation or answer
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reviewed?: boolean;
}

export interface ExamItem {
  id: string;
  subject: string;
  examDate: string; // ISO string or YYYY-MM-DD
  targetGrade?: string;
  syllabusCoveredPercentage: number;
  priority: 'high' | 'medium' | 'low';
  highWeightageTopics: string[];
  dailyRevisionPlan: {
    day: number;
    date: string;
    focus: string;
    hours: number;
    completed: boolean;
  }[];
  flashcards: Flashcard[];
}

export interface RoadmapStage {
  stageNumber: number;
  title: string;
  duration: string;
  coreConcepts: string[];
  recommendedProjects: {
    title: string;
    description: string;
    techStack: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }[];
  freeCertificationsOrResources: string[];
  completed: boolean;
}

export interface CareerRoadmap {
  id: string;
  targetRole: CareerRole;
  branch: EngineeringBranch;
  overview?: string;
  stages?: RoadmapStage[];
  resumeKeySkills?: string[];
  industryTrends?: string;
  yearBreakdown?: {
    year: number;
    title: string;
    focusArea: string;
    milestones: string[];
  }[];
  topSkillsToLearn?: string[];
  recommendedProjects?: {
    title: string;
    description: string;
    techStack: string[];
    difficulty: string;
    githubHighlight?: string;
  }[];
  resumeTips?: string[];
}

export type TaskCategory = 'assignment' | 'lab' | 'project' | 'revision' | 'exam_prep';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  category: TaskCategory;
  completed: boolean;
  priority: TaskPriority;
  estimatedMinutes?: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  codeSnippet?: {
    language: SupportedLanguage;
    code: string;
  };
  references?: string[];
  suggestions?: string[];
}

export type ActiveScreen = 
  | 'splash'
  | 'auth'
  | 'onboarding'
  | 'dashboard'
  | 'study-coach'
  | 'notes-assistant'
  | 'coding-mentor'
  | 'exam-mode'
  | 'career-roadmap'
  | 'productivity'
  | 'ai-chat'
  | 'profile';
