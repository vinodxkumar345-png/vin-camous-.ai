import { StudentProfile, StudyPlan, NoteDocument, ExamItem, CareerRoadmap, Task, ChatMessage } from '../types';

export const initialStudentProfile: StudentProfile = {
  id: 'student_1',
  name: 'Alex Rivers',
  email: 'alex.rivers@college.edu',
  college: 'National Institute of Technology',
  degree: 'B.Tech / B.E.',
  branch: 'Computer Science & Engg (CSE)',
  year: '3rd Year',
  subjects: [
    'Operating Systems',
    'Design & Analysis of Algorithms',
    'Database Management Systems',
    'Computer Networks',
    'Software Engineering'
  ],
  careerInterest: 'Software Developer',
  dailyStudyTargetHours: 3.5,
  currentSkillLevel: 'Intermediate',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  onboardingCompleted: true,
  studyStreakDays: 14,
  totalStudyHours: 42.5,
  topicsMasteredCount: 28
};

export const sampleStudyPlans: StudyPlan[] = [
  {
    id: 'plan_os_1',
    subject: 'Operating Systems',
    topicOrFocus: 'Process Scheduling, Deadlocks & Memory Management',
    dailyHours: 2.5,
    examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    totalTopics: 6,
    completedTopics: 3,
    revisionTips: [
      'Focus on Banker\'s Algorithm safety check matrices - guaranteed 10-mark question',
      'Draw Gantt charts cleanly for Round Robin & SJF preemption',
      'Understand Page Replacement algorithms (LRU, FIFO, Optimal) with reference strings'
    ],
    modules: [
      {
        id: 'mod_1',
        moduleName: 'CPU Scheduling Algorithms',
        estimatedDays: 2,
        topics: [
          {
            id: 'top_1',
            title: 'Round Robin vs Shortest Remaining Time First (SRTF)',
            estimatedMinutes: 45,
            status: 'completed',
            summary: 'Round Robin uses fixed time quantums to guarantee fairness, whereas SRTF minimizes average waiting time but risks starvation of long processes.',
            keyConcepts: ['Time Quantum', 'Context Switch Overhead', 'Convoy Effect', 'Preemption'],
            analogy: 'Imagine a barista at a coffee shop: Round Robin gives every customer 1 minute of attention in turn, while SRTF serves whoever ordered an espresso first before making a complicated mocha.'
          },
          {
            id: 'top_2',
            title: 'Multi-Level Feedback Queue (MLFQ) Scheduling',
            estimatedMinutes: 50,
            status: 'completed',
            summary: 'MLFQ dynamically adjusts priority based on observed process CPU burst patterns, penalizing CPU-bound processes and prioritizing I/O interactive jobs.',
            keyConcepts: ['Aging', 'Starvation Prevention', 'Priority Boosting', 'Dynamic Priority']
          }
        ]
      },
      {
        id: 'mod_2',
        moduleName: 'Deadlocks & Concurrency',
        estimatedDays: 3,
        topics: [
          {
            id: 'top_3',
            title: 'Coffman Conditions & Resource Allocation Graphs',
            estimatedMinutes: 40,
            status: 'completed',
            summary: 'Four conditions must hold simultaneously for deadlock: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. In single-instance RAG, a cycle implies deadlock.',
            keyConcepts: ['Mutual Exclusion', 'Hold & Wait', 'Circular Wait', 'Cycle Detection']
          },
          {
            id: 'top_4',
            title: 'Banker\'s Algorithm for Deadlock Avoidance',
            estimatedMinutes: 60,
            status: 'in-progress',
            summary: 'Banker\'s algorithm tests safety by simulating allocation of pre-declared maximum resources to ensure at least one safe execution sequence exists.',
            keyConcepts: ['Allocation Matrix', 'Max Matrix', 'Need Matrix (Max - Allocation)', 'Available Vector', 'Safe Sequence']
          }
        ]
      },
      {
        id: 'mod_3',
        moduleName: 'Virtual Memory & Page Replacement',
        estimatedDays: 3,
        topics: [
          {
            id: 'top_5',
            title: 'Paging, TLB, and Effective Memory Access Time (EMAT)',
            estimatedMinutes: 55,
            status: 'not-started',
            summary: 'EMAT = Hit_Ratio * (TLB_time + Mem_time) + (1 - Hit_Ratio) * (TLB_time + 2 * Mem_time). TLB acts as a high-speed cache for page table lookups.',
            keyConcepts: ['TLB Hit Ratio', 'Page Fault Penalty', 'Page Table Base Register (PTBR)']
          },
          {
            id: 'top_6',
            title: 'LRU, FIFO & Belady\'s Anomaly',
            estimatedMinutes: 50,
            status: 'not-started',
            summary: 'Belady\'s anomaly describes the phenomenon where increasing page frames leads to more page faults in FIFO. Stack-based algorithms like LRU are immune to this.',
            keyConcepts: ['Page Replacement', 'Belady\'s Anomaly', 'Optimal Page Replacement', 'LRU Approximation']
          }
        ]
      }
    ]
  }
];

export const sampleNotesDocuments: NoteDocument[] = [
  {
    id: 'doc_os_semaphores',
    title: 'Operating Systems: Process Synchronization & Mutex',
    subject: 'Operating Systems',
    uploadedAt: '2 days ago',
    fileType: 'pdf',
    fileName: 'OS_Unit3_Process_Sync_Notes.pdf',
    fileSize: '2.4 MB',
    rawContent: `Operating Systems Unit 3: Process Synchronization
Section 1: Critical Section Problem
A Critical Section is a segment of code where shared resources (memory, files, variables) are accessed. 
Three fundamental conditions must be satisfied by any solution:
1. Mutual Exclusion: If process Pi is executing in its critical section, no other process may execute in their critical section.
2. Progress: If no process is executing in its critical section and some processes wish to enter, only those processes not in remainder section can participate in the decision.
3. Bounded Waiting: There exists a bound on the number of times other processes are allowed to enter their critical sections after a process has made a request.

Section 2: Semaphores & Mutex
A Semaphore S is an integer variable accessed only through two standard atomic operations: wait() (also called P) and signal() (also called V).
Counting Semaphore: Integer value can range over an unrestricted domain. Used for managing resource pools.
Binary Semaphore: Value ranges only between 0 and 1. Behaves like a mutex lock.
Spinlocks: Semaphores with busy-waiting. Waste CPU cycles unless context switch cost exceeds wait time.

Section 3: Classic Synchronization Problems
1. Producer-Consumer Problem (Bounded Buffer): Uses semaphores mutex=1, empty=N, full=0.
2. Readers-Writers Problem: Reader priority can lead to writer starvation. Solution requires writeMutex and readCount lock.
3. Dining Philosophers: 5 philosophers sharing 5 chopsticks. Deadlock occurs if all pick left chopstick simultaneously. Solutions: allow at most 4 at table, or asymmetric chopstick acquisition.`,
    summary: 'Comprehensive lecture notes on critical section requirements (Mutual Exclusion, Progress, Bounded Waiting), counting vs binary semaphores, busy-waiting tradeoffs, and standard synchronization problems (Producer-Consumer, Readers-Writers, Dining Philosophers).',
    keyFormulasAndTheorems: [
      'wait(S): while (S <= 0) { busy-wait }; S--;',
      'signal(S): S++;',
      'Critical Section Protocol: Entry Section -> Critical Section -> Exit Section -> Remainder Section',
      'Bounded Buffer invariant: full + empty = buffer_capacity'
    ],
    importantExamQuestions: [
      {
        question: 'Define the Critical Section problem and explain the three necessary requirements to solve it.',
        marks: 7,
        answerSnippet: 'Mutual Exclusion prevents simultaneous access, Progress ensures unblocked decisions, and Bounded Waiting prevents indefinite postponement.'
      },
      {
        question: 'Differentiate between counting semaphores and binary semaphores with real-world examples.',
        marks: 5,
        answerSnippet: 'Binary semaphores act as a single key to a private restroom (0 or 1). Counting semaphores act like a parking lot counter tracking N available stalls.'
      },
      {
        question: 'How do you prevent deadlock in the Dining Philosophers problem using asymmetric resource allocation?',
        marks: 8,
        answerSnippet: 'Odd numbered philosophers pick left then right; even numbered philosophers pick right then left. This breaks the circular wait condition.'
      }
    ],
    tags: ['Critical Section', 'Semaphores', 'Deadlock', 'Dining Philosophers']
  },
  {
    id: 'doc_daa_dp',
    title: 'Algorithms: Dynamic Programming & Greedy Approaches',
    subject: 'Design & Analysis of Algorithms',
    uploadedAt: 'Yesterday',
    fileType: 'pdf',
    fileName: 'DAA_Lecture7_DP_Greedy.pdf',
    fileSize: '3.1 MB',
    rawContent: `Design and Analysis of Algorithms - Dynamic Programming vs Greedy
Dynamic Programming is an algorithmic paradigm that solves problems by combining solutions to subproblems, caching overlapping subproblem results.
Two key characteristics required:
1. Optimal Substructure: An optimal solution contains optimal solutions to subproblems.
2. Overlapping Subproblems: Subproblems are recomputed repeatedly (contrast with Divide & Conquer where subproblems are disjoint).

Memoization (Top-Down) vs Tabulation (Bottom-Up):
- Top-Down: Uses recursion + cache. Evaluates only needed states. Overhead of function call stack.
- Bottom-Up: Iterative filling of DP table. Avoids call stack overhead. Usually better cache locality.

0/1 Knapsack Problem:
Recurrence:
DP[i][w] = DP[i-1][w] if wt[i-1] > w
DP[i][w] = max(val[i-1] + DP[i-1][w - wt[i-1]], DP[i-1][w]) otherwise.
Time Complexity: O(n * W) -> Pseudo-polynomial.
Space Complexity: O(n * W), optimizable to O(W) with 1D array traversed backwards.

Greedy Method:
Makes locally optimal choice at each step with hope of finding global optimum.
Fractional Knapsack can be solved greedily by sorting items by value-to-weight ratio (val[i]/wt[i]) in O(n log n).`,
    summary: 'Core principles of Dynamic Programming (Optimal Substructure, Overlapping Subproblems), Top-Down Memoization vs Bottom-Up Tabulation, 0/1 Knapsack recurrence & pseudo-polynomial time, and when Greedy strategy succeeds vs fails.',
    keyFormulasAndTheorems: [
      '0/1 Knapsack recurrence: dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])',
      'Time Complexity: O(n * W), where W is knapsack capacity and n is item count',
      'Greedy Ratio for Fractional Knapsack: Density = Value / Weight (Descending sort)'
    ],
    importantExamQuestions: [
      {
        question: 'Why cannot the 0/1 Knapsack problem be solved greedily? Prove with a counter-example.',
        marks: 6,
        answerSnippet: 'Taking the highest value-per-pound item may leave unfillable empty capacity. Example: Capacity 50. Items: (w:10, v:60, ratio:6), (w:20, v:100, ratio:5), (w:30, v:120, ratio:4). Greedy takes item 1 and 2 (wt 30, val 160), whereas items 2 and 3 yield wt 50 and val 220.'
      },
      {
        question: 'Compare Memoization and Tabulation dynamic programming approaches in terms of call stack and state computation.',
        marks: 5,
        answerSnippet: 'Memoization evaluates states on-demand via recursion; Tabulation systematically fills all subproblems iteratively, preventing recursion depth limits.'
      }
    ],
    tags: ['Dynamic Programming', 'Knapsack', 'Memoization', 'Greedy']
  }
];

export const sampleExams: ExamItem[] = [
  {
    id: 'exam_os',
    subject: 'Operating Systems',
    examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString().split('T')[0],
    targetGrade: 'A+ (90%+)',
    syllabusCoveredPercentage: 68,
    priority: 'high',
    highWeightageTopics: [
      'Banker\'s Algorithm & Deadlock Avoidance',
      'CPU Scheduling (Round Robin & SJF)',
      'Page Replacement Algorithms (LRU & Belady\'s Anomaly)',
      'Semaphore Implementation & Producer-Consumer'
    ],
    dailyRevisionPlan: [
      { day: 1, date: 'Day 1', focus: 'Process Management & CPU Scheduling', hours: 3, completed: true },
      { day: 2, date: 'Day 2', focus: 'Synchronization: Semaphores, Mutex & Classic Problems', hours: 3.5, completed: true },
      { day: 3, date: 'Day 3', focus: 'Deadlocks: Coffman conditions, Banker\'s Algorithm', hours: 3, completed: false },
      { day: 4, date: 'Day 4', focus: 'Memory Management: Paging, Segmentation, TLB EMAT', hours: 3.5, completed: false },
      { day: 5, date: 'Day 5', focus: 'Virtual Memory & Page Replacement numericals', hours: 3, completed: false },
      { day: 6, date: 'Day 6', focus: 'File Systems & Disk Scheduling (SCAN, C-LOOK)', hours: 2.5, completed: false },
      { day: 7, date: 'Day 7', focus: 'Full Syllabus Mock Test & Previous Year Questions', hours: 4, completed: false }
    ],
    flashcards: [
      {
        id: 'fc_1',
        front: 'What are the 4 Coffman Conditions for Deadlock?',
        back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\nAll four must hold simultaneously for a deadlock to occur.',
        subject: 'Operating Systems',
        difficulty: 'medium',
        reviewed: true
      },
      {
        id: 'fc_2',
        front: 'What is Belady\'s Anomaly and which algorithm experiences it?',
        back: 'Belady\'s Anomaly is the phenomenon where allocating more page frames results in an INCREASE in the number of page faults.\nIt is experienced by FIFO page replacement. Stack algorithms like LRU are immune.',
        subject: 'Operating Systems',
        difficulty: 'easy',
        reviewed: true
      },
      {
        id: 'fc_3',
        front: 'Formula for Effective Memory Access Time (EMAT) with TLB?',
        back: 'EMAT = h * (t_tlb + t_mem) + (1 - h) * (t_tlb + 2 * t_mem)\nwhere h = TLB hit ratio, t_tlb = TLB lookup time, t_mem = main memory access time.',
        subject: 'Operating Systems',
        difficulty: 'hard',
        reviewed: false
      }
    ]
  },
  {
    id: 'exam_daa',
    subject: 'Design & Analysis of Algorithms',
    examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16).toISOString().split('T')[0],
    targetGrade: 'A (85%+)',
    syllabusCoveredPercentage: 52,
    priority: 'high',
    highWeightageTopics: [
      'Master Theorem & Recurrence Relations',
      'Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain',
      'Graph Algorithms: Dijkstra, Bellman-Ford, Floyd-Warshall',
      'NP-Completeness & Reduction'
    ],
    dailyRevisionPlan: [
      { day: 1, date: 'Day 1', focus: 'Asymptotic Notations & Master Theorem Cases', hours: 2.5, completed: false },
      { day: 2, date: 'Day 2', focus: 'Divide & Conquer: Merge Sort, Quick Sort analysis', hours: 3, completed: false },
      { day: 3, date: 'Day 3', focus: 'Greedy: Huffman Coding, Kruskal & Prim MST', hours: 3, completed: false },
      { day: 4, date: 'Day 4', focus: 'Dynamic Programming: Knapsack & LCS', hours: 3.5, completed: false }
    ],
    flashcards: [
      {
        id: 'fc_daa_1',
        front: 'Master Theorem formula: T(n) = a T(n/b) + f(n)',
        back: 'Compare f(n) with n^(log_b a):\nCase 1: If f(n) = O(n^(log_b a - eps)), T(n) = Theta(n^(log_b a))\nCase 2: If f(n) = Theta(n^(log_b a)), T(n) = Theta(n^(log_b a) * log n)\nCase 3: If f(n) = Omega(n^(log_b a + eps)), T(n) = Theta(f(n))',
        subject: 'Algorithms',
        difficulty: 'medium',
        reviewed: false
      }
    ]
  }
];

export const sampleCareerRoadmaps: Record<string, CareerRoadmap> = {
  'Software Developer': {
    id: 'roadmap_swe',
    targetRole: 'Software Developer',
    branch: 'Computer Science & Engg (CSE)',
    overview: 'Structured 4-year engineering pathway to crack tier-1 product software engineering roles (Google, Microsoft, Amazon, Atlassian, high-growth startups).',
    resumeKeySkills: ['Data Structures & Algorithms', 'C++ / Java / TypeScript', 'System Design & Distributed Systems', 'SQL & NoSQL Databases', 'RESTful APIs & Docker', 'Git & CI/CD'],
    industryTrends: 'High industry demand for full-stack engineers with strong algorithmic problem-solving, microservices understanding, and cloud readiness.',
    stages: [
      {
        stageNumber: 1,
        title: 'Year 1: Programming Foundations & CS Basics',
        duration: 'Semesters 1 - 2',
        coreConcepts: [
          'Proficiency in C/C++ or Java (Pointers, Memory, OOP concepts)',
          'Discrete Mathematics & Logic',
          'Basic Git and GitHub version control',
          'Basics of Linux Terminal'
        ],
        recommendedProjects: [
          {
            title: 'CLI Student Grade Management System in C/C++',
            description: 'File handling, struct pointers, search and sort records.',
            techStack: ['C++', 'File I/O', 'Make'],
            difficulty: 'Beginner'
          }
        ],
        freeCertificationsOrResources: ['CS50x: Introduction to Computer Science (Harvard)', 'NeetCode 150 Beginner DSA Roadmap'],
        completed: true
      },
      {
        stageNumber: 2,
        title: 'Year 2: Data Structures, Algorithms & Core CS',
        duration: 'Semesters 3 - 4',
        coreConcepts: [
          'Linear DS: Arrays, Linked Lists, Stacks, Queues',
          'Non-linear DS: Binary Trees, BST, Heaps, Graphs',
          'Algorithms: Recursion, Backtracking, Binary Search, Dynamic Programming',
          'Core Subjects: Operating Systems, Computer Networks, DBMS'
        ],
        recommendedProjects: [
          {
            title: 'Full-Stack Campus Event Tracker with Auth',
            description: 'REST API, relational schema, JWT auth, responsive client.',
            techStack: ['Node.js/Express', 'PostgreSQL', 'React', 'Tailwind'],
            difficulty: 'Intermediate'
          }
        ],
        freeCertificationsOrResources: ['Striver SDE Sheet (A2Z DSA Course)', 'Stanford CS106B Programming Abstractions'],
        completed: true
      },
      {
        stageNumber: 3,
        title: 'Year 3: Production Projects, Internships & Open Source',
        duration: 'Semesters 5 - 6',
        coreConcepts: [
          'Low-Level Design (LLD): OOP Design Patterns, SOLID Principles',
          'Containerization with Docker & Basic Cloud Deployment (AWS / GCP)',
          '200+ LeetCode Mediums solved',
          'Resume building & Technical Mock Interviews'
        ],
        recommendedProjects: [
          {
            title: 'Real-Time Collaborative Code Editor / Whiteboard',
            description: 'WebSockets, operational transformation/CRDTs, Dockerized backend.',
            techStack: ['TypeScript', 'WebSockets', 'Redis', 'Docker'],
            difficulty: 'Advanced'
          }
        ],
        freeCertificationsOrResources: ['Full Stack Open (University of Helsinki)', 'AWS Educate Cloud Practitioner'],
        completed: false
      },
      {
        stageNumber: 4,
        title: 'Year 4: System Design, Placements & High-Scale Systems',
        duration: 'Semesters 7 - 8',
        coreConcepts: [
          'High-Level Design (HLD): Scalability, Caching (Redis), Load Balancers, Sharding',
          'Behavioral & HR Interview mastery (STAR method)',
          'Company-specific previous placement questions',
          'Offer negotiation & onboarding prep'
        ],
        recommendedProjects: [
          {
            title: 'Distributed Rate Limiter & URL Shortener Service',
            description: 'Token bucket algorithm, Redis caching, microservices layout.',
            techStack: ['Go or Java Spring Boot', 'Redis', 'Kafka', 'PostgreSQL'],
            difficulty: 'Advanced'
          }
        ],
        freeCertificationsOrResources: ['Grokking the System Design Interview', 'Alex Xu System Design ByteByteGo'],
        completed: false
      }
    ]
  },
  'AI/ML Engineer': {
    id: 'roadmap_aiml',
    targetRole: 'AI/ML Engineer',
    branch: 'Computer Science & Engg (CSE)',
    overview: 'Comprehensive roadmap for engineering students targeting Machine Learning, Deep Learning, and Generative AI roles in top labs and product companies.',
    resumeKeySkills: ['Python & PyTorch', 'NumPy, Pandas & Scikit-learn', 'Transformer Architectures & LLMs', 'Vector Databases & RAG', 'Model Fine-tuning & Quantization', 'MLOps & FastAPI'],
    industryTrends: 'Strong shift towards GenAI application engineers, Retrieval-Augmented Generation (RAG) architects, and model optimization specialists.',
    stages: [
      {
        stageNumber: 1,
        title: 'Year 1: Python, Linear Algebra & Calculus',
        duration: 'Semesters 1 - 2',
        coreConcepts: ['Python OOP & Vectorized Computation', 'Linear Algebra (Eigenvalues, SVD, Matrix Operations)', 'Multivariate Calculus & Gradients', 'Probability & Statistics'],
        recommendedProjects: [
          {
            title: 'Exploratory Data Analysis on Real-World Datasets',
            description: 'Data cleaning, hypothesis testing, interactive plots with Seaborn.',
            techStack: ['Python', 'Pandas', 'Matplotlib', 'Jupyter'],
            difficulty: 'Beginner'
          }
        ],
        freeCertificationsOrResources: ['3Blue1Brown Essence of Linear Algebra', 'Kaggle Python & Pandas Micro-Courses'],
        completed: true
      },
      {
        stageNumber: 2,
        title: 'Year 2: Classical Machine Learning & Deep Learning Fundamentals',
        duration: 'Semesters 3 - 4',
        coreConcepts: ['Supervised & Unsupervised Learning', 'Gradient Descent, Loss Functions, Regularization', 'Feedforward Neural Networks, CNNs, RNNs in PyTorch', 'Evaluation Metrics (ROC-AUC, F1-Score)'],
        recommendedProjects: [
          {
            title: 'Medical Image Classification with Convolutional Networks',
            description: 'Transfer learning with ResNet/EfficientNet, data augmentation, Grad-CAM interpretability.',
            techStack: ['PyTorch', 'Torchvision', 'FastAPI'],
            difficulty: 'Intermediate'
          }
        ],
        freeCertificationsOrResources: ['Andrew Ng Machine Learning Specialization (DeepLearning.AI)', 'Fast.ai Practical Deep Learning for Coders'],
        completed: false
      },
      {
        stageNumber: 3,
        title: 'Year 3: Transformers, LLMs, RAG & MLOps',
        duration: 'Semesters 5 - 6',
        coreConcepts: ['Self-Attention & Transformer Architecture', 'Fine-tuning with LoRA / QLoRA', 'RAG pipelines with Vector DBs (Chroma, Pinecone)', 'MLOps: Experiment tracking with WandB, Docker containerization'],
        recommendedProjects: [
          {
            title: 'Multi-Modal Academic Research Paper Assistant',
            description: 'Chunking PDFs, embedding search, Gemini/LLM reasoning with source citations.',
            techStack: ['Python', 'LangChain/LlamaIndex', 'Qdrant', 'Streamlit/React'],
            difficulty: 'Advanced'
          }
        ],
        freeCertificationsOrResources: ['Hugging Face NLP Course', 'DeepLearning.AI Generative AI for Everyone'],
        completed: false
      },
      {
        stageNumber: 4,
        title: 'Year 4: Research, Scalable Model Serving & Placements',
        duration: 'Semesters 7 - 8',
        coreConcepts: ['High-throughput inference with vLLM & ONNX', 'Distributed training (DDP, FSDP)', 'AI Safety, Evaluation & Alignment', 'Industry Capstone & Research Publication'],
        recommendedProjects: [
          {
            title: 'Production Real-Time Voice-to-Action Copilot',
            description: 'Streaming audio processing, function calling, low latency inference.',
            techStack: ['Python', 'WebSockets', 'PyTorch', 'Docker'],
            difficulty: 'Advanced'
          }
        ],
        freeCertificationsOrResources: ['CS25: Transformers United (Stanford)', 'Full Stack Deep Learning Course'],
        completed: false
      }
    ]
  }
};

export const sampleTasks: Task[] = [
  {
    id: 'task_1',
    title: 'OS Lab 4: Implement Banker\'s Algorithm in C',
    subject: 'Operating Systems',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
    category: 'lab',
    completed: false,
    priority: 'high',
    estimatedMinutes: 90,
    notes: 'Include safety check and resource request algorithm routines with clear output formatting.'
  },
  {
    id: 'task_2',
    title: 'DAA Problem Set 3: 0/1 Knapsack & Subset Sum',
    subject: 'Design & Analysis of Algorithms',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString().split('T')[0],
    category: 'assignment',
    completed: false,
    priority: 'high',
    estimatedMinutes: 60,
    notes: 'Solve both bottom-up DP table and space-optimized 1D array version.'
  },
  {
    id: 'task_3',
    title: 'DBMS Project: Submit Schema Diagram & 3NF Normalization',
    subject: 'Database Management Systems',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString().split('T')[0],
    category: 'project',
    completed: true,
    priority: 'medium',
    estimatedMinutes: 120,
    notes: 'Uploaded ER diagram and SQL DDL scripts to GitHub.'
  },
  {
    id: 'task_4',
    title: 'Review Computer Networks: Subnetting & CIDR calculations',
    subject: 'Computer Networks',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
    category: 'revision',
    completed: false,
    priority: 'medium',
    estimatedMinutes: 45,
    notes: 'Practice calculating valid host ranges and broadcast addresses for /26 and /28 subnets.'
  }
];

export const sampleCodeSnippets: Record<string, string> = {
  c: `#include <stdio.h>
#include <stdlib.h>

// Reverse an array in-place using two pointers
void reverseArray(int arr[], int size) {
    int left = 0;
    int right = size - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}

int main() {
    int numbers[] = {12, 45, 78, 23, 56, 89, 90};
    int n = sizeof(numbers) / sizeof(numbers[0]);

    printf("Original array: ");
    for(int i = 0; i < n; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");

    reverseArray(numbers, n);

    printf("Reversed array: ");
    for(int i = 0; i < n; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");

    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
#include <algorithm>

// Binary search implementation in C++
int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid; // Found
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Not found
}

int main() {
    std::vector<int> sortedData = {10, 23, 35, 47, 59, 68, 81, 99};
    int target = 47;
    int index = binarySearch(sortedData, target);

    if (index != -1) {
        std::cout << "Element " << target << " found at index: " << index << std::endl;
    } else {
        std::cout << "Element not found." << std::endl;
    }
    return 0;
}`,
  python: `# Fibonacci sequence with memoization in Python
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

# Test first 10 Fibonacci numbers
first_10 = [fibonacci(i) for i in range(10)]
print(f"First 10 Fibonacci numbers: {first_10}")
print(f"50th Fibonacci number: {fibonacci(50)}")
`,
  java: `public class Main {
    // Check if a string is a palindrome
    public static boolean isPalindrome(String s) {
        String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        int left = 0;
        int right = clean.length() - 1;

        while (left < right) {
            if (clean.charAt(left) != clean.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        String test = "A man, a plan, a canal: Panama";
        boolean result = isPalindrome(test);
        System.out.println("Input: \\"" + test + "\\"");
        System.out.println("Is Palindrome? " + result);
    }
}`,
  javascript: `// Two Sum Problem using Hash Map
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
console.log("Input Array:", nums);
console.log("Target:", target);
console.log("Indices:", twoSum(nums, target));
`
};

export const sampleChatWelcome: ChatMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'assistant',
    text: "Hey Alex! 👋 I'm **CampusAI**, your personal college copilot. Whether you need to break down a complex Operating Systems algorithm, debug tricky C/C++ pointers, plan your semester revision schedule, or map out your tech career path — I'm right here with you. What are we tackling today?",
    timestamp: 'Just now',
    suggestions: [
      'Explain Banker\'s Algorithm in simple terms with an analogy',
      'Help me debug a segmentation fault in C',
      'What should a 3rd year CSE student focus on for placements?',
      'Create a 3-day revision plan for my Computer Networks exam'
    ]
  }
];
