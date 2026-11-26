-- ============================================================
-- NEXUS: Smart Placement and Job Management System
-- Sample Data Insertion Script (Week 1)
-- ============================================================

USE placement_management;

-- ------------------------------------------------------------
-- 1. Insert 2 ADMIN Users and 10 STUDENT Users
-- ------------------------------------------------------------
INSERT INTO users (id, name, email, password, role) VALUES
-- Admin Accounts
(1, 'Placement Officer Admin', 'admin.placement@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'ADMIN'),
(2, 'Dean Student Affairs', 'dean.affairs@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'ADMIN'),

-- Student Accounts (IDs 3 through 12)
(3, 'Aarav Sharma', 'aarav.sharma@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(4, 'Priya Patel', 'priya.patel@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(5, 'Rohan Verma', 'rohan.verma@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(6, 'Ananya Iyer', 'ananya.iyer@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(7, 'Vikram Singh', 'vikram.singh@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(8, 'Sneha Mukherjee', 'sneha.mukherjee@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(9, 'Karthik Raja', 'karthik.raja@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(10, 'Ishita Nair', 'ishita.nair@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(11, 'Kabir Mehta', 'kabir.mehta@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT'),
(12, 'Diya Sen', 'diya.sen@nexus.edu', '$2a$12$e8w.b0l2o.XQ8hP9qE59gOnX567kL2mQ0r1t2y3u4i5o6p7a8s9d', 'STUDENT');

-- ------------------------------------------------------------
-- 2. Insert 10 Corresponding Student Profiles
-- ------------------------------------------------------------
INSERT INTO students (id, user_id, roll_number, branch, cgpa, graduation_year, phone, resume_url) VALUES
(1, 3, 'CS202301', 'Computer Science & Engineering', 8.92, 2027, '+91-9876543210', 'https://nexus.edu/resumes/aarav_sharma.pdf'),
(2, 4, 'IT202315', 'Information Technology', 9.15, 2027, '+91-9876543211', 'https://nexus.edu/resumes/priya_patel.pdf'),
(3, 5, 'EC202308', 'Electronics & Communication', 7.85, 2027, '+91-9876543212', 'https://nexus.edu/resumes/rohan_verma.pdf'),
(4, 6, 'CS202342', 'Computer Science & Engineering', 9.40, 2027, '+91-9876543213', 'https://nexus.edu/resumes/ananya_iyer.pdf'),
(5, 7, 'ME202322', 'Mechanical Engineering', 7.40, 2027, '+91-9876543214', 'https://nexus.edu/resumes/vikram_singh.pdf'),
(6, 8, 'EE202319', 'Electrical Engineering', 8.20, 2027, '+91-9876543215', 'https://nexus.edu/resumes/sneha_mukherjee.pdf'),
(7, 9, 'CS202355', 'Computer Science & Engineering', 8.65, 2027, '+91-9876543216', 'https://nexus.edu/resumes/karthik_raja.pdf'),
(8, 10, 'IT202330', 'Information Technology', 8.78, 2027, '+91-9876543217', 'https://nexus.edu/resumes/ishita_nair.pdf'),
(9, 11, 'CS202377', 'Computer Science & Engineering', 6.95, 2027, '+91-9876543218', 'https://nexus.edu/resumes/kabir_mehta.pdf'),
(10, 12, 'EC202334', 'Electronics & Communication', 8.10, 2027, '+91-9876543219', 'https://nexus.edu/resumes/diya_sen.pdf');

-- ------------------------------------------------------------
-- 3. Insert 5 Companies
-- ------------------------------------------------------------
INSERT INTO companies (id, name, industry, location, website, contact_email, description) VALUES
(1, 'Apex Cloud Technologies', 'Cloud & SaaS Solutions', 'Bengaluru, Karnataka', 'https://apexcloud.io', 'campus@apexcloud.io', 'Global leader in enterprise distributed cloud computing and scalable infrastructure.'),
(2, 'Nexus Cybernetics', 'Artificial Intelligence & Robotics', 'Hyderabad, Telangana', 'https://nexuscyber.ai', 'careers@nexuscyber.ai', 'Specializes in autonomous AI agents, machine perception, and high-performance computing.'),
(3, 'FinPulse Digital Bank', 'Financial Technology', 'Mumbai, Maharashtra', 'https://finpulse.com', 'hiring@finpulse.com', 'Next-generation core digital banking and automated micro-lending payment infrastructure.'),
(4, 'Veritas Health Solutions', 'HealthTech & Bioinformatics', 'Pune, Maharashtra', 'https://veritashealth.org', 'recruit@veritashealth.org', 'Digital healthcare platform bridging medical diagnostics, tele-consultation, and AI genomics.'),
(5, 'Aether Mobility Labs', 'Electric Vehicles & CleanTech', 'Chennai, Tamil Nadu', 'https://aethermobility.in', 'campus.relations@aethermobility.in', 'Pioneering smart connected electric urban transport vehicles and battery telemetry.');

-- ------------------------------------------------------------
-- 4. Insert 10 Job Postings
-- ------------------------------------------------------------
INSERT INTO jobs (id, company_id, title, description, job_type, salary_package, eligible_branch, min_cgpa, location, deadline) VALUES
(1, 1, 'Associate Cloud Engineer', 'Design and deploy scalable containerized microservices on AWS and GCP.', 'Full-time', 14.50, 'CSE, IT, ECE', 7.50, 'Bengaluru', '2026-12-15'),
(2, 1, 'DevOps Platform Trainee', 'Automate CI/CD pipelines, Kubernetes cluster provisioning, and infrastructure monitoring.', 'Full-time', 12.00, 'CSE, IT', 7.00, 'Remote', '2026-12-20'),
(3, 2, 'AI/ML Research Engineer', 'Train foundational vision and natural language models; build real-time inference engines.', 'Full-time', 22.00, 'CSE, IT, ECE', 8.50, 'Hyderabad', '2026-12-10'),
(4, 2, 'Computer Vision Intern', 'Develop edge-AI perception algorithms for robotic sensor fusion and obstacle detection.', 'Internship', 6.00, 'All Branches', 7.00, 'Hyderabad', '2026-12-05'),
(5, 3, 'Backend Java Developer', 'Architect secure high-throughput transaction processing pipelines using Spring Boot and Kafka.', 'Full-time', 16.00, 'CSE, IT', 8.00, 'Mumbai', '2026-12-18'),
(6, 3, 'Security Analyst Trainee', 'Perform vulnerability assessments, threat modeling, and secure code reviews for banking APIs.', 'Full-time', 11.50, 'CSE, IT, ECE', 7.50, 'Mumbai', '2026-12-22'),
(7, 4, 'Full Stack Web Developer', 'Build accessible healthcare provider portals using React, TypeScript, and REST web services.', 'Full-time', 13.00, 'CSE, IT', 7.00, 'Pune', '2026-12-25'),
(8, 4, 'Data Analyst - Healthcare', 'Analyze clinical cohort trends, build dashboards, and optimize clinical workflow models.', 'Full-time', 9.50, 'All Branches', 6.50, 'Remote', '2026-12-30'),
(9, 5, 'Embedded Firmware Engineer', 'Program ARM microcontrollers, CAN bus communications, and battery management systems.', 'Full-time', 15.00, 'ECE, EEE, MECH', 7.20, 'Chennai', '2026-12-12'),
(10, 5, 'IoT Systems Specialist', 'Implement telemetry data collection from vehicle fleet to cloud event streams.', 'Full-time', 10.50, 'ECE, EEE, CSE, IT', 6.80, 'Chennai', '2026-12-28');

-- ------------------------------------------------------------
-- 5. Insert 15 Job Applications (No duplicates per student-job)
-- ------------------------------------------------------------
INSERT INTO applications (id, student_id, job_id, applied_date, status, remarks) VALUES
(1, 1, 1, '2026-11-20 10:15:00', 'SHORTLISTED', 'Strong performance in online coding round and cloud portfolio.'),
(2, 1, 3, '2026-11-21 11:30:00', 'APPLIED', 'Application under preliminary resume screening.'),
(3, 2, 1, '2026-11-20 14:00:00', 'SHORTLISTED', 'High CGPA, cleared technical aptitude.'),
(4, 2, 5, '2026-11-22 09:20:00', 'ACCEPTED', 'Offered role after final technical interview.'),
(5, 3, 9, '2026-11-21 16:45:00', 'SHORTLISTED', 'Embedded C practical assessment score 92%.'),
(6, 4, 3, '2026-11-20 08:30:00', 'ACCEPTED', 'Top percentile candidate; accepted offer for AI Research.'),
(7, 4, 7, '2026-11-21 13:10:00', 'SHORTLISTED', 'Portfolio showcased impressive React projects.'),
(8, 5, 9, '2026-11-22 17:00:00', 'REJECTED', 'Eligibility criteria not met for core firmware requirements.'),
(9, 6, 9, '2026-11-23 10:05:00', 'APPLIED', 'Under committee evaluation.'),
(10, 6, 10, '2026-11-23 15:25:00', 'SHORTLISTED', 'Strong IoT lab project credentials.'),
(11, 7, 1, '2026-11-24 11:10:00', 'APPLIED', 'Application submitted successfully.'),
(12, 7, 5, '2026-11-24 12:40:00', 'APPLIED', 'Application submitted successfully.'),
(13, 8, 7, '2026-11-22 14:50:00', 'SHORTLISTED', 'Cleared technical round 1.'),
(14, 8, 8, '2026-11-23 16:15:00', 'APPLIED', 'Application under review.'),
(15, 10, 10, '2026-11-24 18:00:00', 'APPLIED', 'Application under review.');
