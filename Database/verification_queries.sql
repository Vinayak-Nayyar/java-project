-- ============================================================
-- NEXUS: Database Verification Queries & Instructions
-- ============================================================

USE placement_management;

-- ------------------------------------------------------------
-- HOW TO EXECUTE IN MYSQL WORKBENCH:
-- 1. Open MySQL Workbench and connect to your local MySQL instance (Default port 3306).
-- 2. Open schema.sql via File -> Open SQL Script (or press Ctrl+Shift+O).
-- 3. Click the yellow lightning bolt icon (Execute entire script) to create database and tables.
-- 4. Open sample_data.sql via File -> Open SQL Script.
-- 5. Click the lightning bolt icon to insert all users, students, companies, jobs, and applications.
-- 6. Open this verification script (verification_queries.sql) and execute the queries below.
-- ------------------------------------------------------------

-- Query 1: Total count of users categorized by role
SELECT role, COUNT(*) AS total_users
FROM users
GROUP BY role
WITH ROLLUP;

-- Query 2: Total count of students
SELECT COUNT(*) AS total_students
FROM students;

-- Query 3: Total count of companies
SELECT COUNT(*) AS total_companies
FROM companies;

-- Query 4: Total count of jobs
SELECT COUNT(*) AS total_jobs
FROM jobs;

-- Query 5: Total count of applications
SELECT COUNT(*) AS total_applications
FROM applications;

-- Query 6: Jobs posted by each company (with salary packages and deadlines)
SELECT 
    c.id AS company_id,
    c.name AS company_name,
    COUNT(j.id) AS total_jobs_posted,
    COALESCE(GROUP_CONCAT(j.title SEPARATOR ' | '), 'None') AS job_titles
FROM companies c
LEFT JOIN jobs j ON c.id = j.company_id
GROUP BY c.id, c.name
ORDER BY c.id ASC;

-- Query 7: Applications received by each job (with company name and applicant counts)
SELECT 
    j.id AS job_id,
    j.title AS job_title,
    c.name AS company_name,
    COUNT(a.id) AS total_applications,
    SUM(CASE WHEN a.status = 'SHORTLISTED' THEN 1 ELSE 0 END) AS shortlisted_count,
    SUM(CASE WHEN a.status = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted_count
FROM jobs j
JOIN companies c ON j.company_id = c.id
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.id, j.title, c.name
ORDER BY total_applications DESC;

-- Query 8: Detailed application overview joining student and user information
SELECT 
    a.id AS application_id,
    u.name AS student_name,
    s.roll_number,
    s.branch,
    s.cgpa,
    c.name AS company_name,
    j.title AS job_title,
    j.salary_package AS package_lpa,
    a.status,
    a.applied_date
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN users u ON s.user_id = u.id
JOIN jobs j ON a.job_id = j.id
JOIN companies c ON j.company_id = c.id
ORDER BY a.applied_date DESC;
