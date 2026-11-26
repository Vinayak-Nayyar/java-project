-- ============================================================
-- NEXUS: Smart Placement and Job Management System
-- Database Schema Definition (Week 1)
-- Database Engine: MySQL 8.0+
-- ============================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS placement_management;
USE placement_management;

-- Drop dependent tables in reverse dependency order for clean recreation
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

-- ============================================================
-- Table 1: USERS
-- Stores core authentication credentials and system roles.
-- ============================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STUDENT') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table 2: STUDENTS
-- Stores student academic profiles linked 1:1 with users.
-- ============================================================
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    branch VARCHAR(100) NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL,
    graduation_year INT NOT NULL,
    phone VARCHAR(20),
    resume_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table 3: COMPANIES
-- Stores corporate recruiting partners.
-- ============================================================
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    industry VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    website VARCHAR(255),
    contact_email VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table 4: JOBS
-- Stores recruitment job postings created by companies (1:N).
-- ============================================================
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    job_type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
    salary_package DECIMAL(10,2) NOT NULL, -- Stored as LPA (Lakhs Per Annum)
    eligible_branch VARCHAR(100) NOT NULL DEFAULT 'All Branches',
    min_cgpa DECIMAL(3,2) NOT NULL DEFAULT 6.00,
    location VARCHAR(150) NOT NULL,
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_jobs_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table 5: APPLICATIONS
-- Associative table resolving M:N between Students and Jobs.
-- ============================================================
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    job_id INT NOT NULL,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('APPLIED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED') NOT NULL DEFAULT 'APPLIED',
    remarks TEXT,
    CONSTRAINT unique_student_job UNIQUE (student_id, job_id),
    CONSTRAINT fk_applications_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_applications_job
        FOREIGN KEY (job_id) REFERENCES jobs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
