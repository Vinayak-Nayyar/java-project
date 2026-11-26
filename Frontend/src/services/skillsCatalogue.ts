export interface PredefinedSkill {
  name: string;
  category: string;
}

export const PREDEFINED_SKILLS: PredefinedSkill[] = [
  // PROGRAMMING LANGUAGES
  { name: 'C', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages' },
  { name: 'C#', category: 'Programming Languages' },
  { name: 'Java', category: 'Programming Languages' },
  { name: 'Python', category: 'Programming Languages' },
  { name: 'JavaScript', category: 'Programming Languages' },
  { name: 'TypeScript', category: 'Programming Languages' },
  { name: 'Go', category: 'Programming Languages' },
  { name: 'Kotlin', category: 'Programming Languages' },
  { name: 'PHP', category: 'Programming Languages' },
  { name: 'SQL', category: 'Programming Languages' },

  // FRONTEND
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'React', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Bootstrap', category: 'Frontend' },

  // BACKEND
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'REST API', category: 'Backend' },

  // DATABASES
  { name: 'MySQL', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'SQLite', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },

  // AI AND MACHINE LEARNING
  { name: 'Machine Learning', category: 'AI & Machine Learning' },
  { name: 'Deep Learning', category: 'AI & Machine Learning' },
  { name: 'Artificial Intelligence', category: 'AI & Machine Learning' },
  { name: 'TensorFlow', category: 'AI & Machine Learning' },
  { name: 'PyTorch', category: 'AI & Machine Learning' },
  { name: 'Scikit-learn', category: 'AI & Machine Learning' },
  { name: 'NLP', category: 'AI & Machine Learning' },
  { name: 'Computer Vision', category: 'AI & Machine Learning' },
  { name: 'Generative AI', category: 'AI & Machine Learning' },
  { name: 'Data Science', category: 'AI & Machine Learning' },

  // TOOLS AND TECHNOLOGIES
  { name: 'Git', category: 'Tools & Technologies' },
  { name: 'GitHub', category: 'Tools & Technologies' },
  { name: 'Docker', category: 'Tools & Technologies' },
  { name: 'Kubernetes', category: 'Tools & Technologies' },
  { name: 'Linux', category: 'Tools & Technologies' },
  { name: 'AWS', category: 'Tools & Technologies' },
  { name: 'Azure', category: 'Tools & Technologies' },
  { name: 'Figma', category: 'Tools & Technologies' },
  { name: 'Postman', category: 'Tools & Technologies' },

  // CORE COMPUTER SCIENCE
  { name: 'Data Structures & Algorithms', category: 'Core Computer Science' },
  { name: 'Object-Oriented Programming', category: 'Core Computer Science' },
  { name: 'Operating Systems', category: 'Core Computer Science' },
  { name: 'Computer Networks', category: 'Core Computer Science' },
  { name: 'Database Management Systems', category: 'Core Computer Science' },
  { name: 'Software Engineering', category: 'Core Computer Science' }
];

export const SKILL_CATEGORIES = Array.from(
  new Set(PREDEFINED_SKILLS.map((s) => s.category))
);
