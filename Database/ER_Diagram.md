# NEXUS - Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| STUDENTS : "has profile (1:1)"
    COMPANIES ||--o{ JOBS : "posts (1:N)"
    STUDENTS ||--o{ APPLICATIONS : "submits (1:N)"
    JOBS ||--o{ APPLICATIONS : "receives (1:N)"

    USERS {
        int id PK "AUTO_INCREMENT"
        string name "NOT NULL"
        string email UK "NOT NULL, UNIQUE"
        string password "NOT NULL"
        enum role "ADMIN, STUDENT"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    STUDENTS {
        int id PK "AUTO_INCREMENT"
        int user_id FK, UK "NOT NULL, UNIQUE -> USERS(id)"
        string roll_number UK "NOT NULL, UNIQUE"
        string branch "NOT NULL"
        decimal cgpa "DECIMAL(3,2), NOT NULL"
        int graduation_year "NOT NULL"
        string phone "VARCHAR(20)"
        string resume_url "VARCHAR(255)"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    COMPANIES {
        int id PK "AUTO_INCREMENT"
        string name UK "NOT NULL, UNIQUE"
        string industry "NOT NULL"
        string location "NOT NULL"
        string website "VARCHAR(255)"
        string contact_email "NOT NULL"
        text description "TEXT"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    JOBS {
        int id PK "AUTO_INCREMENT"
        int company_id FK "NOT NULL -> COMPANIES(id)"
        string title "NOT NULL"
        text description "NOT NULL"
        string job_type "DEFAULT 'Full-time'"
        decimal salary_package "DECIMAL(10,2), NOT NULL"
        string eligible_branch "NOT NULL"
        decimal min_cgpa "DECIMAL(3,2), NOT NULL"
        string location "NOT NULL"
        date deadline "NOT NULL"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    APPLICATIONS {
        int id PK "AUTO_INCREMENT"
        int student_id FK "NOT NULL -> STUDENTS(id)"
        int job_id FK "NOT NULL -> JOBS(id)"
        timestamp applied_date "DEFAULT CURRENT_TIMESTAMP"
        enum status "APPLIED, SHORTLISTED, REJECTED, ACCEPTED"
        text remarks "TEXT"
    }
```

### Cardinality Summary
- **USERS to STUDENTS**: `1 : 0..1` (One-to-One / Optional for ADMIN users). Every student profile corresponds to exactly one user account with role `STUDENT`.
- **COMPANIES to JOBS**: `1 : N` (One-to-Many). One company can publish zero or many job listings.
- **STUDENTS to JOBS (via APPLICATIONS)**: `M : N` (Many-to-Many resolved by the associative `APPLICATIONS` entity).
  - A student can submit multiple applications (`1 : N`).
  - A job can receive applications from multiple students (`1 : N`).
  - Constraint: `UNIQUE(student_id, job_id)` prevents a student from applying to the same job multiple times.
