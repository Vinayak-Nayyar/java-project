import { Job } from '../types/Job';
import { AuthUser } from '../types/AuthUser';

export interface TargetRoleDefinition {
  id: string;
  title: string;
  description: string;
  requiredSkills: Array<{
    name: string;
    importance: 'Critical' | 'High';
    explanation: string;
  }>;
  preferredSkills: Array<{
    name: string;
    importance: 'Bonus';
    explanation: string;
  }>;
}

export const TARGET_ROLES: TargetRoleDefinition[] = [
  {
    id: 'backend-dev',
    title: 'Backend Developer',
    description: 'Designs and builds server-side applications, microservices, databases, and high-throughput transactional APIs.',
    requiredSkills: [
      { name: 'Java', importance: 'Critical', explanation: 'Primary language for enterprise banking, e-commerce, and high-volume platforms.' },
      { name: 'Spring Boot', importance: 'Critical', explanation: 'Dominant microservices framework providing dependency injection and robust REST controllers.' },
      { name: 'MySQL', importance: 'Critical', explanation: 'Relational data modeling, ACID transactions, and query optimization.' },
      { name: 'REST API', importance: 'Critical', explanation: 'Core architecture for client-server HTTP communication and JSON serialization.' },
      { name: 'SQL', importance: 'Critical', explanation: 'Complex queries, aggregations, indexing, and performance tuning.' },
      { name: 'Object-Oriented Programming', importance: 'High', explanation: 'Clean code architecture, design patterns, and maintainable domain models.' }
    ],
    preferredSkills: [
      { name: 'Docker', importance: 'Bonus', explanation: 'Containerization for consistent deployment across staging and production.' },
      { name: 'Redis', importance: 'Bonus', explanation: 'High-speed in-memory caching and session state management.' },
      { name: 'Git', importance: 'Bonus', explanation: 'Distributed version control and collaborative pull request workflows.' },
      { name: 'Linux', importance: 'Bonus', explanation: 'Server command line navigation, process management, and shell scripting.' },
      { name: 'Postman', importance: 'Bonus', explanation: 'API endpoint testing, contract validation, and automated regression collections.' }
    ]
  },
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    description: 'Creates responsive, accessible, and high-performance interactive web interfaces and single-page applications.',
    requiredSkills: [
      { name: 'React', importance: 'Critical', explanation: 'Component-based architecture, state management, and virtual DOM rendering.' },
      { name: 'TypeScript', importance: 'Critical', explanation: 'Static typing that eliminates runtime errors and enables robust refactoring.' },
      { name: 'JavaScript', importance: 'Critical', explanation: 'Core web programming language, ES6+ asynchronous features, and DOM manipulation.' },
      { name: 'HTML', importance: 'Critical', explanation: 'Semantic web document structuring and web accessibility standards.' },
      { name: 'CSS', importance: 'Critical', explanation: 'Responsive layout design, Flexbox, Grid, and cross-browser consistency.' },
      { name: 'Bootstrap', importance: 'High', explanation: 'Rapid grid prototyping, responsive navigation, and standardized form elements.' }
    ],
    preferredSkills: [
      { name: 'Tailwind CSS', importance: 'Bonus', explanation: 'Utility-first styling system for rapid custom interface assembly.' },
      { name: 'Next.js', importance: 'Bonus', explanation: 'Server-side rendering, static site generation, and SEO optimization.' },
      { name: 'Git', importance: 'Bonus', explanation: 'Version control and collaboration with design and backend teams.' },
      { name: 'Figma', importance: 'Bonus', explanation: 'Translating UI/UX wireframes and component tokens into pixel-perfect code.' }
    ]
  },
  {
    id: 'software-dev',
    title: 'Software Developer',
    description: 'Generalist software engineer building robust algorithmic applications, backend logic, and full-stack solutions.',
    requiredSkills: [
      { name: 'Data Structures & Algorithms', importance: 'Critical', explanation: 'Core benchmark in all campus technical screening rounds and online coding assessments.' },
      { name: 'Object-Oriented Programming', importance: 'Critical', explanation: 'Encapsulation, inheritance, polymorphism, and modular codebase architecture.' },
      { name: 'Java', importance: 'Critical', explanation: 'Industry standard for enterprise software, multithreading, and systems programming.' },
      { name: 'SQL', importance: 'High', explanation: 'Interacting with structured databases and executing data aggregations.' },
      { name: 'Operating Systems', importance: 'High', explanation: 'Understanding process scheduling, memory virtualization, concurrency, and threading.' }
    ],
    preferredSkills: [
      { name: 'Git', importance: 'Bonus', explanation: 'Code versioning and Git branching workflows.' },
      { name: 'Database Management Systems', importance: 'Bonus', explanation: 'Schema normalization, indexing, and transaction management.' },
      { name: 'Computer Networks', importance: 'Bonus', explanation: 'TCP/IP socket protocol foundations, DNS, and HTTP/HTTPS handshakes.' },
      { name: 'Docker', importance: 'Bonus', explanation: 'Standardizing development and production execution environments.' }
    ]
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    description: 'Builds, trains, evaluates, and deploys predictive machine learning and deep neural network models.',
    requiredSkills: [
      { name: 'Python', importance: 'Critical', explanation: 'Universal lingua franca for data science and machine learning libraries.' },
      { name: 'Machine Learning', importance: 'Critical', explanation: 'Supervised and unsupervised mathematical models, regression, classification, and metrics.' },
      { name: 'Deep Learning', importance: 'Critical', explanation: 'Neural network architectures, backpropagation, and loss function optimization.' },
      { name: 'PyTorch', importance: 'High', explanation: 'Leading research and production deep learning framework with dynamic computational graphs.' },
      { name: 'TensorFlow', importance: 'High', explanation: 'Production-scale model training and edge deployment pipelines.' }
    ],
    preferredSkills: [
      { name: 'Scikit-learn', importance: 'Bonus', explanation: 'Classical ML algorithms, feature scaling, and train-test cross-validation.' },
      { name: 'Computer Vision', importance: 'Bonus', explanation: 'Convolutional neural networks for object detection and visual feature extraction.' },
      { name: 'NLP', importance: 'Bonus', explanation: 'Transformer models and tokenization for natural language understanding.' },
      { name: 'Docker', importance: 'Bonus', explanation: 'Packaging inference containers for cloud serving.' }
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Extracts, cleans, transforms, and visualizes complex business datasets to empower data-driven decisions.',
    requiredSkills: [
      { name: 'SQL', importance: 'Critical', explanation: 'Writing complex JOINs, window functions, and data warehouse queries.' },
      { name: 'Python', importance: 'Critical', explanation: 'Automated data manipulation with Pandas, NumPy, and statistical packages.' },
      { name: 'Data Science', importance: 'Critical', explanation: 'Statistical inference, hypothesis testing, and exploratory data analysis.' },
      { name: 'MySQL', importance: 'High', explanation: 'Querying relational databases to generate business performance reports.' }
    ],
    preferredSkills: [
      { name: 'PostgreSQL', importance: 'Bonus', explanation: 'Advanced analytical indexing and complex JSON queries.' },
      { name: 'Machine Learning', importance: 'Bonus', explanation: 'Basic predictive modeling for customer segmentation and forecasting.' },
      { name: 'Git', importance: 'Bonus', explanation: 'Version control for analysis notebooks and data transformation scripts.' }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Blends advanced statistical modeling, algorithmic experimentation, and domain expertise to solve complex predictive problems.',
    requiredSkills: [
      { name: 'Python', importance: 'Critical', explanation: 'Exploratory data analysis, matrix mathematics, and machine learning model training.' },
      { name: 'Machine Learning', importance: 'Critical', explanation: 'Predictive modeling, ensemble techniques (XGBoost, Random Forests), and model evaluation.' },
      { name: 'Data Science', importance: 'Critical', explanation: 'Statistical modeling, distribution analysis, and experimental design.' },
      { name: 'SQL', importance: 'High', explanation: 'Extracting and transforming millions of raw event records from analytical databases.' }
    ],
    preferredSkills: [
      { name: 'Deep Learning', importance: 'Bonus', explanation: 'Neural representation learning and sequential data modeling.' },
      { name: 'NLP', importance: 'Bonus', explanation: 'Text processing and contextual embedding extraction.' },
      { name: 'Generative AI', importance: 'Bonus', explanation: 'Prompt engineering, retrieval-augmented generation (RAG), and fine-tuning.' },
      { name: 'Git', importance: 'Bonus', explanation: 'Version control for experimental scientific code.' }
    ]
  }
];

// Helper: Extract skills expected for a job from its title, description and branch
export const getJobSkillRequirements = (job: Job): { required: string[]; preferred: string[] } => {
  const text = `${job.title} ${job.description} ${job.eligibleBranch}`.toLowerCase();
  const required: string[] = [];
  const preferred: string[] = [];

  const skillMapping: Record<string, { name: string; priority: 'req' | 'pref' }> = {
    cloud: { name: 'AWS', priority: 'req' },
    aws: { name: 'AWS', priority: 'req' },
    gcp: { name: 'Docker', priority: 'req' },
    devops: { name: 'Docker', priority: 'req' },
    kubernetes: { name: 'Kubernetes', priority: 'pref' },
    docker: { name: 'Docker', priority: 'req' },
    ci: { name: 'Git', priority: 'pref' },
    git: { name: 'Git', priority: 'pref' },
    ai: { name: 'Artificial Intelligence', priority: 'req' },
    ml: { name: 'Machine Learning', priority: 'req' },
    'computer vision': { name: 'Computer Vision', priority: 'req' },
    nlp: { name: 'NLP', priority: 'pref' },
    pytorch: { name: 'PyTorch', priority: 'pref' },
    tensorflow: { name: 'TensorFlow', priority: 'pref' },
    java: { name: 'Java', priority: 'req' },
    spring: { name: 'Spring Boot', priority: 'req' },
    kafka: { name: 'REST API', priority: 'pref' },
    backend: { name: 'MySQL', priority: 'req' },
    api: { name: 'REST API', priority: 'req' },
    web: { name: 'React', priority: 'req' },
    react: { name: 'React', priority: 'req' },
    typescript: { name: 'TypeScript', priority: 'req' },
    data: { name: 'SQL', priority: 'req' },
    sql: { name: 'SQL', priority: 'req' },
    analyst: { name: 'Python', priority: 'req' },
    python: { name: 'Python', priority: 'req' },
    embedded: { name: 'C', priority: 'req' },
    firmware: { name: 'C++', priority: 'req' },
    iot: { name: 'Linux', priority: 'pref' }
  };

  Object.entries(skillMapping).forEach(([keyword, { name, priority }]) => {
    if (text.includes(keyword)) {
      if (priority === 'req' && !required.includes(name)) {
        required.push(name);
      } else if (priority === 'pref' && !preferred.includes(name) && !required.includes(name)) {
        preferred.push(name);
      }
    }
  });

  // Fallback defaults if few keywords matched
  if (required.length === 0) {
    required.push('Java', 'SQL', 'Object-Oriented Programming');
    preferred.push('Git', 'REST API');
  }

  return { required, preferred };
};

// Calculate job readiness score
export interface JobReadinessResult {
  jobId: number;
  jobTitle: string;
  companyName: string;
  readinessScore: number; // 0 - 100
  category: 'Strong Match' | 'Moderate Match' | 'Needs Improvement';
  matchedSkills: string[];
  missingSkills: string[];
  preferredSkillsMatched: string[];
  preferredSkillsMissing: string[];
  academicEligibility: {
    cgpaEligible: boolean;
    studentCgpa: number;
    requiredCgpa: number;
    branchEligible: boolean;
    studentBranch: string;
    requiredBranch: string;
  };
  scoreBreakdown: {
    academicPoints: number; // Max 30
    skillsPoints: number; // Max 50
    profileCompletenessPoints: number; // Max 20
  };
  explanation: string;
}

export const evaluateJobReadiness = (job: Job, student: AuthUser): JobReadinessResult => {
  const { required, preferred } = getJobSkillRequirements(job);
  const studentSkills = student.skills || [];

  const matchedSkills = required.filter((s) =>
    studentSkills.some((sk) => sk.toLowerCase() === s.toLowerCase())
  );
  const missingSkills = required.filter(
    (s) => !studentSkills.some((sk) => sk.toLowerCase() === s.toLowerCase())
  );

  const preferredSkillsMatched = preferred.filter((s) =>
    studentSkills.some((sk) => sk.toLowerCase() === s.toLowerCase())
  );
  const preferredSkillsMissing = preferred.filter(
    (s) => !studentSkills.some((sk) => sk.toLowerCase() === s.toLowerCase())
  );

  // 1. Academic Check (Max 30 points)
  const studentCgpa = student.cgpa !== undefined ? student.cgpa : 8.92;
  const cgpaEligible = studentCgpa >= job.minCgpa;

  const branchText = job.eligibleBranch.toLowerCase();
  const studentBranch = (student.branch || 'Computer Science & Engineering').toLowerCase();
  const branchEligible =
    branchText.includes('all branches') ||
    branchText.includes('cse') ||
    branchText.includes('it') ||
    branchText.includes(studentBranch);

  let academicPoints = 0;
  if (cgpaEligible) academicPoints += 18;
  if (branchEligible) academicPoints += 12;

  // 2. Skill Check (Max 50 points)
  const requiredRatio = required.length > 0 ? matchedSkills.length / required.length : 1;
  const preferredBonus = preferred.length > 0 ? (preferredSkillsMatched.length / preferred.length) * 10 : 5;
  const skillsPoints = Math.round(requiredRatio * 40 + preferredBonus);

  // 3. Profile & Resume Completeness (Max 20 points)
  let profileCompletenessPoints = 0;
  if (student.resumeFileName) profileCompletenessPoints += 10;
  if (student.phone) profileCompletenessPoints += 5;
  if (student.college) profileCompletenessPoints += 5;

  const totalScore = Math.min(100, Math.max(10, academicPoints + skillsPoints + profileCompletenessPoints));

  let category: 'Strong Match' | 'Moderate Match' | 'Needs Improvement' = 'Needs Improvement';
  if (totalScore >= 75) {
    category = 'Strong Match';
  } else if (totalScore >= 50) {
    category = 'Moderate Match';
  }

  let explanation = '';
  if (category === 'Strong Match') {
    explanation = `High compatibility with ${job.companyName}'s ${job.title}. Your CGPA (${studentCgpa}) exceeds the cut-off (${job.minCgpa}) and your profile covers ${matchedSkills.length} of ${required.length} core technical requirements.`;
  } else if (category === 'Moderate Match') {
    explanation = `Moderate compatibility. You meet academic cut-offs, but acquiring ${missingSkills.slice(0, 2).join(' & ')} will substantially improve selection odds.`;
  } else {
    explanation = `Currently needs technical alignment. Key required skills (${missingSkills.join(', ')}) are absent from your profile, which may affect resume screening.`;
  }

  return {
    jobId: job.id,
    jobTitle: job.title,
    companyName: job.companyName,
    readinessScore: totalScore,
    category,
    matchedSkills,
    missingSkills,
    preferredSkillsMatched,
    preferredSkillsMissing,
    academicEligibility: {
      cgpaEligible,
      studentCgpa,
      requiredCgpa: job.minCgpa,
      branchEligible,
      studentBranch: student.branch || 'Computer Science & Engineering',
      requiredBranch: job.eligibleBranch
    },
    scoreBreakdown: {
      academicPoints,
      skillsPoints,
      profileCompletenessPoints
    },
    explanation
  };
};

// Skill Gap Analysis evaluation
export interface SkillGapResult {
  roleId: string;
  roleTitle: string;
  strongSkills: Array<{ name: string; category: string }>;
  skillsToImprove: Array<{ name: string; category: string; reason: string }>;
  missingSkills: Array<{ name: string; importance: string; explanation: string }>;
  gapCoveragePercent: number;
}

export const evaluateSkillGaps = (roleId: string, student: AuthUser): SkillGapResult => {
  const role = TARGET_ROLES.find((r) => r.id === roleId) || TARGET_ROLES[0];
  const studentSkills = student.skills || [];

  const strongSkills: Array<{ name: string; category: string }> = [];
  const skillsToImprove: Array<{ name: string; category: string; reason: string }> = [];
  const missingSkills: Array<{ name: string; importance: string; explanation: string }> = [];

  role.requiredSkills.forEach((req) => {
    const hasSkill = studentSkills.some((s) => s.toLowerCase() === req.name.toLowerCase());
    if (hasSkill) {
      strongSkills.push({ name: req.name, category: 'Core Required' });
    } else {
      missingSkills.push({
        name: req.name,
        importance: req.importance,
        explanation: req.explanation
      });
    }
  });

  role.preferredSkills.forEach((pref) => {
    const hasSkill = studentSkills.some((s) => s.toLowerCase() === pref.name.toLowerCase());
    if (hasSkill) {
      skillsToImprove.push({
        name: pref.name,
        category: 'Preferred Tooling',
        reason: 'Recommended to expand from foundational to advanced production usage.'
      });
    } else {
      missingSkills.push({
        name: pref.name,
        importance: pref.importance,
        explanation: pref.explanation
      });
    }
  });

  const totalEvaluated = role.requiredSkills.length + role.preferredSkills.length;
  const possessedCount = strongSkills.length + skillsToImprove.length;
  const gapCoveragePercent = Math.round((possessedCount / totalEvaluated) * 100);

  return {
    roleId: role.id,
    roleTitle: role.title,
    strongSkills,
    skillsToImprove,
    missingSkills,
    gapCoveragePercent
  };
};

// Resume Analysis Breakdown
export interface ResumeAnalysisScore {
  overallScore: number; // 0 - 100
  categories: {
    technicalSkills: { score: number; feedback: string };
    projects: { score: number; feedback: string };
    education: { score: number; feedback: string };
    experience: { score: number; feedback: string };
    achievements: { score: number; feedback: string };
    formatting: { score: number; feedback: string };
  };
  strengths: string[];
  weaknesses: string[];
  actionableRecommendations: string[];
  extractedEntities: {
    skillsCount: number;
    skillsSample: string[];
    educationSummary: string;
    resumeFileName: string;
    estimatedWordCount: number;
  };
}

export const evaluateResumeQuality = (student: AuthUser): ResumeAnalysisScore => {
  const skills = student.skills || [];
  const hasResume = !!student.resumeFileName;
  const cgpa = student.cgpa !== undefined ? student.cgpa : 8.92;

  // Technical skills score (Max 100)
  const skillsScore = Math.min(95, Math.max(50, skills.length * 11));

  // Projects score
  const projectsScore = hasResume ? 82 : 60;

  // Education score (based on CGPA)
  const educationScore = Math.min(98, Math.round(cgpa * 9.8));

  // Experience / Internships score
  const experienceScore = 70;

  // Achievements
  const achievementsScore = cgpa >= 8.5 ? 85 : 68;

  // Formatting & Structure
  const formattingScore = hasResume ? 88 : 55;

  const overall = Math.round(
    skillsScore * 0.25 +
    projectsScore * 0.25 +
    educationScore * 0.20 +
    experienceScore * 0.15 +
    achievementsScore * 0.05 +
    formattingScore * 0.10
  );

  const strengths: string[] = [];
  if (cgpa >= 8.0) strengths.push(`Outstanding academic standing with a verified CGPA of ${cgpa} / 10.00.`);
  if (skills.length >= 5) strengths.push(`Diverse technology portfolio covering ${skills.slice(0, 4).join(', ')}.`);
  if (hasResume) strengths.push(`Verified single-column PDF resume format uploaded and compliant with ATS filters.`);
  strengths.push(`Clear institutional pedigree at ${student.college || 'National Institute of Technology'}.`);

  const weaknesses: string[] = [];
  if (!skills.some((s) => ['Docker', 'AWS', 'Kubernetes'].includes(s))) {
    weaknesses.push('Lacks demonstrable cloud infrastructure or containerization skills (e.g. Docker, AWS).');
  }
  weaknesses.push('Project bullet points need more quantifiable metrics (e.g. latency reductions, active users).');
  weaknesses.push('No competitive programming milestones or open-source PR links highlighted.');

  const actionableRecommendations: string[] = [
    'Quantify project outcomes using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
    'Include direct GitHub repository and live demo URLs alongside every featured technical project.',
    'Add an explicit "Core Competencies" subsection highlighting high-impact keywords like RESTful Microservices, SQL Optimization, and CI/CD.',
    'Highlight coursework relevant to target company tech stacks (e.g. Distributed Systems, Cloud Architecture).'
  ];

  return {
    overallScore: overall,
    categories: {
      technicalSkills: {
        score: skillsScore,
        feedback: `${skills.length} verified technologies identified in profile.`
      },
      projects: {
        score: projectsScore,
        feedback: 'Solid full-stack project foundations; needs quantifiable business impact metrics.'
      },
      education: {
        score: educationScore,
        feedback: `Consistently high performance (${cgpa} CGPA in ${student.branch || 'Engineering'}).`
      },
      experience: {
        score: experienceScore,
        feedback: 'Good academic project involvement; summer technical internship will boost rating.'
      },
      achievements: {
        score: achievementsScore,
        feedback: 'High academic rank; consider adding hackathon or competitive coding badges.'
      },
      formatting: {
        score: formattingScore,
        feedback: 'Clean single-column ATS typography and distinct section headers.'
      }
    },
    strengths,
    weaknesses,
    actionableRecommendations,
    extractedEntities: {
      skillsCount: skills.length,
      skillsSample: skills.slice(0, 6),
      educationSummary: `${student.degree || 'B.Tech'} - ${student.branch || 'CSE'} (Class of ${student.graduationYear || 2027})`,
      resumeFileName: student.resumeFileName || 'Aarav_Sharma_Technical_Resume.pdf',
      estimatedWordCount: 420
    }
  };
};

// Learning Roadmap Definition
export interface RoadmapStage {
  id: string;
  stageNumber: number;
  title: string;
  timeframe: string;
  focus: string;
  skillsToCover: string[];
  tasks: Array<{
    id: string;
    description: string;
    resource: string;
    resourceType: 'Docs' | 'Practice' | 'Project' | 'Tutorial';
  }>;
  recommendedProject: {
    title: string;
    summary: string;
  };
}

export const generateRoadmap = (targetRoleId: string, missingSkills: string[]): RoadmapStage[] => {
  const role = TARGET_ROLES.find((r) => r.id === targetRoleId) || TARGET_ROLES[0];
  const primaryGap = missingSkills[0] || 'Docker';
  const secondaryGap = missingSkills[1] || 'Redis';
  const thirdGap = missingSkills[2] || 'AWS';

  return [
    {
      id: 'stage-1',
      stageNumber: 1,
      title: 'Phase 1: High-Impact Core Skill Gaps',
      timeframe: 'Weeks 1 – 2 (Estimated 15 Hours)',
      focus: `Master foundational mechanics of ${primaryGap} and industry standard patterns.`,
      skillsToCover: [primaryGap, 'Clean Code Architecture'],
      tasks: [
        {
          id: 's1-t1',
          description: `Study ${primaryGap} official documentation and fundamental paradigms`,
          resource: 'Official Documentation & Guides',
          resourceType: 'Docs'
        },
        {
          id: 's1-t2',
          description: `Build a standalone prototype verifying ${primaryGap} capabilities`,
          resource: 'GitHub Sample Repository',
          resourceType: 'Practice'
        },
        {
          id: 's1-t3',
          description: 'Refactor existing code to adhere to SOLID architectural design principles',
          resource: 'Refactoring Guru Design Patterns',
          resourceType: 'Tutorial'
        }
      ],
      recommendedProject: {
        title: `${primaryGap} Microservice Boilerplate`,
        summary: `A standalone, production-ready starter template demonstrating ${primaryGap} integration, unit testing, and logging.`
      }
    },
    {
      id: 'stage-2',
      stageNumber: 2,
      title: 'Phase 2: Applied Architecture & Caching/Data Layers',
      timeframe: 'Weeks 3 – 4 (Estimated 20 Hours)',
      focus: `Incorporate ${secondaryGap} to solve high-concurrency challenges and data scalability.`,
      skillsToCover: [secondaryGap, 'SQL Performance Tuning', 'RESTful API Contracts'],
      tasks: [
        {
          id: 's2-t1',
          description: `Implement ${secondaryGap} caching layers to decrease query response latencies`,
          resource: 'Redis University / High Scalability Case Studies',
          resourceType: 'Docs'
        },
        {
          id: 's2-t2',
          description: 'Profile slow database queries and design compound composite B-tree indexes',
          resource: 'Use The Index, Luke! SQL Guide',
          resourceType: 'Tutorial'
        },
        {
          id: 's2-t3',
          description: 'Document endpoints with OpenAPI 3.0 / Swagger and automate contract testing',
          resource: 'Postman API Testing Collections',
          resourceType: 'Practice'
        }
      ],
      recommendedProject: {
        title: 'Distributed Rate Limiter & High-Throughput Cache Service',
        summary: `A resilient API gateway module utilizing ${secondaryGap} for token-bucket rate limiting and sub-10ms response caching.`
      }
    },
    {
      id: 'stage-3',
      stageNumber: 3,
      title: 'Phase 3: Production Deployment & Containerization',
      timeframe: 'Weeks 5 – 6 (Estimated 18 Hours)',
      focus: `Containerize applications and deploy reproducible services to cloud infrastructure (${thirdGap}).`,
      skillsToCover: [thirdGap, 'CI/CD Pipelines', 'Linux Shell'],
      tasks: [
        {
          id: 's3-t1',
          description: 'Write multi-stage Dockerfiles optimizing image size and layer caching',
          resource: 'Docker Best Practices Guide',
          resourceType: 'Docs'
        },
        {
          id: 's3-t2',
          description: 'Configure automated GitHub Actions workflow executing unit tests on every commit',
          resource: 'GitHub Actions Marketplace',
          resourceType: 'Practice'
        },
        {
          id: 's3-t3',
          description: `Deploy application container to ${thirdGap} with health checks and SSL termination`,
          resource: 'AWS Free Tier / Render Cloud Guides',
          resourceType: 'Project'
        }
      ],
      recommendedProject: {
        title: `Full-Stack Enterprise Placement Engine (${role.title} Capstone)`,
        summary: 'An end-to-end multi-tier platform containerized with Docker, automated via GitHub Actions, and deployed live with real-time telemetry.'
      }
    },
    {
      id: 'stage-4',
      stageNumber: 4,
      title: 'Phase 4: Algorithmic Rigor & Placement Mock Rounds',
      timeframe: 'Weeks 7 – 8 (Estimated 16 Hours)',
      focus: 'Data structures problem-solving and behavioral technical interview readiness.',
      skillsToCover: ['Data Structures & Algorithms', 'System Design Foundations'],
      tasks: [
        {
          id: 's4-t1',
          description: 'Solve 25 medium-difficulty problems on Trees, Graphs, Dynamic Programming, and Two Pointers',
          resource: 'LeetCode / NeetCode 150 Tracker',
          resourceType: 'Practice'
        },
        {
          id: 's4-t2',
          description: 'Review low-level system design: Concurrency, Thread Pools, and Class Diagrams',
          resource: 'Grokking the Low Level Design',
          resourceType: 'Tutorial'
        },
        {
          id: 's4-t3',
          description: 'Conduct peer mock technical interviews under timed assessment conditions',
          resource: 'NEXUS Placement Interview Checklist',
          resourceType: 'Docs'
        }
      ],
      recommendedProject: {
        title: 'Live Technical Portfolio & Project Showcase',
        summary: 'A polished, interactive personal portfolio demonstrating your capstone repositories, live deployments, and architecture diagrams.'
      }
    }
  ];
};

// Resume Assistant Bullet Rewrites
export interface BulletSuggestion {
  id: string;
  category: 'Project' | 'Experience' | 'Skill Showcase';
  originalText: string;
  improvedText: string;
  explanation: string;
  impactMetricsAdded: string;
}

export const SAMPLE_BULLET_SUGGESTIONS: BulletSuggestion[] = [
  {
    id: 'b1',
    category: 'Project',
    originalText: 'Created a student placement web application using React and Spring Boot with a database.',
    improvedText: 'Architected an enterprise placement management portal with React, TypeScript, and Spring Boot; optimized SQL indexing to reduce query response latencies by 35% across 500+ records.',
    explanation: 'Uses the high-impact action verb "Architected" instead of passive "Created", and introduces measurable performance results (35% latency reduction, 500+ records).',
    impactMetricsAdded: '35% query response latency reduction, 500+ records'
  },
  {
    id: 'b2',
    category: 'Project',
    originalText: 'Used MySQL to store job applications and made sure students cannot apply twice.',
    improvedText: 'Engineered a 3NF relational schema in MySQL 8.0 enforcing referential integrity and multi-column unique constraints to achieve zero duplicate submissions.',
    explanation: 'Demonstrates deep database architectural understanding (3NF, relational integrity, unique constraints) rather than simple table creation.',
    impactMetricsAdded: '100% submission idempotency, 3NF schema'
  },
  {
    id: 'b3',
    category: 'Experience',
    originalText: 'Helped the development team fix bugs and write tests for backend endpoints.',
    improvedText: 'Authored 30+ comprehensive JUnit integration tests covering REST controllers and DAO methods, boosting code coverage to 92% across critical authentication flows.',
    explanation: 'Quantifies test volume (30+) and measurable code coverage (92%), highlighting reliability and testing diligence.',
    impactMetricsAdded: '30+ JUnit integration tests, 92% coverage'
  },
  {
    id: 'b4',
    category: 'Skill Showcase',
    originalText: 'Good knowledge of Java, Spring, React, REST APIs, Git, and Docker.',
    improvedText: 'Applied modern Java 17, Spring Boot, and React workflows to build containerized microservices and automated CI/CD deployment pipelines.',
    explanation: 'Replaces passive "good knowledge" skill lists with contextualized real-world engineering actions ("containerized microservices", "automated CI/CD").',
    impactMetricsAdded: 'Containerized microservice architecture'
  }
];

export const ACTION_VERBS_CATALOG = [
  { verb: 'Architected', meaning: 'Designed complex multi-tier software or system structures.' },
  { verb: 'Engineered', meaning: 'Built highly reliable technical solutions to challenging problems.' },
  { verb: 'Optimized', meaning: 'Enhanced execution speed, reduced memory usage, or cut cloud cost.' },
  { verb: 'Automated', meaning: 'Replaced repetitive manual workflows with scripted pipelines.' },
  { verb: 'Deployed', meaning: 'Shipped production containers or web services into live staging.' },
  { verb: 'Refactored', meaning: 'Restructured legacy code to improve readability and test coverage.' }
];
