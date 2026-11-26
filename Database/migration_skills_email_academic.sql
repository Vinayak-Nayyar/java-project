-- ============================================================
-- NEXUS: Database Migration Script
-- Adds: Skills Catalogue, Student-Skills Junction,
--       Email Verifications, and Academic Profile Enhancements
-- ============================================================

USE placement_management;

-- 1. Enhance students table with academic & location fields
ALTER TABLE students 
    ADD COLUMN IF NOT EXISTS college VARCHAR(150) DEFAULT 'National Institute of Technology, Karnataka',
    ADD COLUMN IF NOT EXISTS degree VARCHAR(100) DEFAULT 'Bachelor of Technology (B.Tech)',
    ADD COLUMN IF NOT EXISTS location VARCHAR(150) DEFAULT 'Bengaluru, Karnataka';

-- 2. Create normalized SKILLS catalogue table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create STUDENT_SKILLS associative table (resolves M:N)
CREATE TABLE IF NOT EXISTS student_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_skill UNIQUE (student_id, skill_id),
    CONSTRAINT fk_student_skills_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_student_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create EMAIL_VERIFICATIONS table for secure verification workflows
CREATE TABLE IF NOT EXISTS email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    current_email VARCHAR(150) NOT NULL,
    new_email VARCHAR(150) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'VERIFIED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_email_verif_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Seed Predefined Skill Catalogue (50+ Curated Industry Skills)
-- ------------------------------------------------------------
INSERT IGNORE INTO skills (name, category) VALUES
-- Programming Languages
('C', 'Programming Languages'),
('C++', 'Programming Languages'),
('C#', 'Programming Languages'),
('Java', 'Programming Languages'),
('Python', 'Programming Languages'),
('JavaScript', 'Programming Languages'),
('TypeScript', 'Programming Languages'),
('Go', 'Programming Languages'),
('Kotlin', 'Programming Languages'),
('PHP', 'Programming Languages'),
('SQL', 'Programming Languages'),

-- Frontend
('HTML', 'Frontend'),
('CSS', 'Frontend'),
('React', 'Frontend'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),
('Next.js', 'Frontend'),
('Tailwind CSS', 'Frontend'),
('Bootstrap', 'Frontend'),

-- Backend
('Node.js', 'Backend'),
('Express.js', 'Backend'),
('Spring Boot', 'Backend'),
('FastAPI', 'Backend'),
('Django', 'Backend'),
('Flask', 'Backend'),
('REST API', 'Backend'),

-- Databases
('MySQL', 'Databases'),
('PostgreSQL', 'Databases'),
('MongoDB', 'Databases'),
('SQLite', 'Databases'),
('Redis', 'Databases'),

-- AI and Machine Learning
('Machine Learning', 'AI & Machine Learning'),
('Deep Learning', 'AI & Machine Learning'),
('Artificial Intelligence', 'AI & Machine Learning'),
('TensorFlow', 'AI & Machine Learning'),
('PyTorch', 'AI & Machine Learning'),
('Scikit-learn', 'AI & Machine Learning'),
('NLP', 'AI & Machine Learning'),
('Computer Vision', 'AI & Machine Learning'),
('Generative AI', 'AI & Machine Learning'),
('Data Science', 'AI & Machine Learning'),

-- Tools and Technologies
('Git', 'Tools & Technologies'),
('GitHub', 'Tools & Technologies'),
('Docker', 'Tools & Technologies'),
('Kubernetes', 'Tools & Technologies'),
('Linux', 'Tools & Technologies'),
('AWS', 'Tools & Technologies'),
('Azure', 'Tools & Technologies'),
('Figma', 'Tools & Technologies'),
('Postman', 'Tools & Technologies'),

-- Core Computer Science
('Data Structures & Algorithms', 'Core Computer Science'),
('Object-Oriented Programming', 'Core Computer Science'),
('Operating Systems', 'Core Computer Science'),
('Computer Networks', 'Core Computer Science'),
('Database Management Systems', 'Core Computer Science'),
('Software Engineering', 'Core Computer Science');

-- ------------------------------------------------------------
-- 6. Link Sample Student (Aarav Sharma - Student ID 1) with Initial Skills
-- ------------------------------------------------------------
INSERT IGNORE INTO student_skills (student_id, skill_id)
SELECT 1, id FROM skills WHERE name IN ('Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL', 'Docker', 'Git');
