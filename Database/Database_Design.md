# NEXUS: Database Design Document

## 1. Overview
The **NEXUS Smart Placement and Job Management System** database is designed using a clean 3NF relational model to support campus recruitment, company job listings, student applications, and administrative placement management.

Database Name: `placement_management`

---

## 2. Entity Specifications

### 2.1 USERS
Stores system credentials and primary user identity.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique user identifier.
- `name` (VARCHAR(100), NOT NULL): Full name of the user.
- `email` (VARCHAR(150), NOT NULL, UNIQUE): Institutional or personal email used for authentication.
- `password` (VARCHAR(255), NOT NULL): Secure hashed password credential.
- `role` (ENUM('ADMIN', 'STUDENT'), NOT NULL): User authorization role.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Account registration timestamp.

### 2.2 STUDENTS
Contains extended academic and profile data for users with the `STUDENT` role.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Student profile identifier.
- `user_id` (INT, NOT NULL, UNIQUE): Foreign key pointing to `users(id)`.
- `roll_number` (VARCHAR(50), NOT NULL, UNIQUE): Unique university roll number.
- `branch` (VARCHAR(100), NOT NULL): Department / Academic branch (e.g., Computer Science, Information Technology, Electronics).
- `cgpa` (DECIMAL(3,2), NOT NULL): Cumulative Grade Point Average (0.00 - 10.00).
- `graduation_year` (INT, NOT NULL): Passing out year.
- `phone` (VARCHAR(20), NULL): Contact phone number.
- `resume_url` (VARCHAR(255), NULL): Link or reference to uploaded student resume.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Profile creation timestamp.

### 2.3 COMPANIES
Represents recruiting partners and organizations.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique company identifier.
- `name` (VARCHAR(150), NOT NULL, UNIQUE): Registered corporate company name.
- `industry` (VARCHAR(100), NOT NULL): Operating sector (e.g., Software, Cloud Computing, FinTech).
- `location` (VARCHAR(150), NOT NULL): Primary office or headquarters location.
- `website` (VARCHAR(255), NULL): Official company website URL.
- `contact_email` (VARCHAR(150), NOT NULL): Official HR or recruiter point of contact.
- `description` (TEXT, NULL): Company profile and summary.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.

### 2.4 JOBS
Listings and vacancies published by recruiting companies.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique job listing identifier.
- `company_id` (INT, NOT NULL): Foreign key referencing `companies(id)`.
- `title` (VARCHAR(150), NOT NULL): Position designation (e.g., Software Development Engineer, Data Analyst).
- `description` (TEXT, NOT NULL): Job role description, responsibilities, and perks.
- `job_type` (VARCHAR(50), NOT NULL, DEFAULT 'Full-time'): Type of employment (Full-time, Internship, Contract).
- `salary_package` (DECIMAL(10,2), NOT NULL): Annual compensation in LPA (Lakhs Per Annum).
- `eligible_branch` (VARCHAR(100), NOT NULL, DEFAULT 'All Branches'): Branch criteria required.
- `min_cgpa` (DECIMAL(3,2), NOT NULL, DEFAULT 6.00): Minimum academic cut-off CGPA.
- `location` (VARCHAR(150), NOT NULL): Work location or 'Remote'.
- `deadline` (DATE, NOT NULL): Last date for students to submit applications.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Listing timestamp.

### 2.5 APPLICATIONS
Associative junction entity resolving the Many-to-Many relationship between Students and Jobs.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Application identifier.
- `student_id` (INT, NOT NULL): Foreign key referencing `students(id)`.
- `job_id` (INT, NOT NULL): Foreign key referencing `jobs(id)`.
- `applied_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Submission timestamp.
- `status` (ENUM('APPLIED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'), NOT NULL, DEFAULT 'APPLIED'): Application state.
- `remarks` (TEXT, NULL): Reviewer or administrative remarks.
- Constraint: `UNIQUE KEY unique_student_job (student_id, job_id)` guarantees idempotency (no duplicate applications for the same job).

---

## 3. Referential Integrity & ON DELETE Behavior

1. **`students(user_id) -> users(id)` (ON DELETE CASCADE)**
   - *Reasoning*: A Student profile is intrinsically tied to its User authentication record. If the underlying user is removed, orphan student academic records should not remain.
2. **`jobs(company_id) -> companies(id)` (ON DELETE CASCADE)**
   - *Reasoning*: Job opportunities are published strictly under a corporate parent entity. If a company account is purged, its vacancies become void.
3. **`applications(student_id) -> students(id)` (ON DELETE CASCADE)**
   - *Reasoning*: If a student profile is deleted, all their pending or past placement applications must be purged to maintain clean records.
4. **`applications(job_id) -> jobs(id)` (ON DELETE CASCADE)**
   - *Reasoning*: If a job posting is cancelled or withdrawn, associated applications cannot proceed and are purged.

---

## 4. Execution Order
To respect foreign key dependencies:
1. `users`
2. `students` (depends on `users`)
3. `companies`
4. `jobs` (depends on `companies`)
5. `applications` (depends on `students` and `jobs`)
