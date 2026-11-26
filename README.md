# NEXUS: Smart Placement and Job Management System

**Academic Capstone Project (Week 1 Implementation)**

---

## 1. Project Overview
**NEXUS** is a comprehensive, layered web platform engineered to streamline campus recruitment drives, automate company vacancy postings, and track student placement applications across academic departments.

During **Week 1**, the primary architectural foundation was established across three discrete, decoupled sectors, supplemented by client-side authentication, a comprehensive user profile system, guaranteed single-line badges, and an authentication-aware SaaS footer:
1. **Database**: Relational 3NF entity-relationship architecture, schema DDL with constraints, realistic sample dataset, and verification queries.
2. **Backend**: Spring Boot Maven foundation with pure JDBC and DAO data-access patterns (avoiding JPA/Hibernate to demonstrate foundational database and Java OOP concepts), custom connection pooling utilities, application logging, and RESTful health check endpoints.
3. **Frontend**: Modern, responsive React + TypeScript application built on Vite and Bootstrap with:
   - Centralized authentication context (`AuthContext`) persisted across page refreshes via `localStorage`.
   - Dynamic Navbar displaying avatar, user indicator, and role-tailored dropdown on login.
   - Dedicated `/profile` page with view & edit modes, avatar preview, academic credentials, technical skills tags, and validated PDF resume management.
   - Global single-line capsule & badge CSS rules (`white-space: nowrap`, `width: fit-content`, `min-height: 28px`).
   - Premium 4-section SaaS-style Footer with role-aware resources and interactive legal modals.
   - Protected routes with role-based access control.

---

## 2. Technology Stack

### Database
- **Engine**: MySQL 8.0+
- **Dialect**: SQL (InnoDB, utf8mb4)
- **Tools**: MySQL Workbench / MySQL CLI

### Backend
- **Language**: Java 17+ (Compiled and tested on JDK 26)
- **Framework**: Spring Boot 3.2.5 (`spring-boot-starter-web`)
- **Persistence**: Pure JDBC (`java.sql.*`, `PreparedStatement`, `ResultSet`, `DBConnection`)
- **Driver**: MySQL Connector/J (`com.mysql:mysql-connector-j:8.3.0`)
- **Build Tool**: Apache Maven 3.9.6
- **Logging**: `java.util.logging` writing to `app.log`

### Frontend
- **Library**: React 18
- **Language**: TypeScript 5
- **Tooling**: Vite 5
- **Routing**: React Router DOM 6
- **Styling**: Bootstrap 5.3 + Custom Neo-Editorial CSS Design Tokens

---

## 3. Project Directory Structure

```
java project/
├── Backend/
│   ├── mvnw.cmd                                # Portable Maven command wrapper
│   ├── pom.xml                                 # Maven dependencies & build configuration
│   ├── .gitignore                              # Backend artifact exclusions
│   └── src/
│       ├── main/
│       │   ├── java/com/nexus/placement/
│       │   │   ├── controller/
│       │   │   │   └── HelloController.java    # GET /api/hello REST endpoint
│       │   │   ├── dao/
│       │   │   │   ├── CompanyDAO.java         # CRUD interface
│       │   │   │   ├── CompanyDAOImpl.java     # JDBC implementation with PreparedStatement
│       │   │   │   └── CompanyDAOTest.java     # Standalone main() test verifying CRUD
│       │   │   ├── exception/
│       │   │   │   └── DatabaseException.java  # Runtime database exception wrapper
│       │   │   ├── model/
│       │   │   │   ├── User.java               # Abstract base class
│       │   │   │   ├── Student.java            # Extends User
│       │   │   │   ├── Company.java            # Corporate partner entity
│       │   │   │   ├── Job.java                # Job posting entity
│       │   │   │   └── Application.java        # Application junction entity
│       │   │   ├── service/
│       │   │   │   └── package-info.java       # Reserved for Week 2 business logic
│       │   │   ├── util/
│       │   │   │   ├── AppLogger.java          # java.util.logging -> app.log
│       │   │   │   ├── DBConnection.java       # Properties-backed JDBC connection factory
│       │   │   │   └── DBConnectionTest.java   # Standalone main() connection test
│       │   │   └── NexusPlacementApplication.java # Spring Boot main entry point
│       │   └── resources/
│       │       ├── application.properties      # Spring Boot server configuration
│       │       └── db.properties               # Externalized database credentials
│       └── test/
├── Database/
│   ├── ER_Diagram.md                           # Relational ER diagram in Mermaid notation
│   ├── Database_Design.md                      # Detailed entity, attribute, cardinality specs
│   ├── schema.sql                              # DDL script creating placement_management & 5 tables
│   ├── sample_data.sql                         # Realistic sample dataset (admins, students, jobs)
│   └── verification_queries.sql                # Analytical verification queries & Workbench guide
├── Frontend/
│   ├── package.json                            # React, TypeScript, Vite, Bootstrap dependencies
│   ├── vite.config.ts                          # Vite build & dev server configuration
│   ├── tsconfig.json                           # TypeScript configuration
│   ├── index.html                              # Web document entry point with Google Fonts
│   ├── .gitignore                              # Frontend exclusions
│   └── src/
│       ├── main.tsx                            # Root application bootstrap
│       ├── App.tsx                             # Route definitions & layout wrapper
│       ├── index.css                           # Custom styling, color palette & neo-cards
│       ├── components/
│       │   ├── Navbar.tsx                      # Header with brand badge & auth buttons
│       │   ├── Footer.tsx                      # Responsive footer
│       │   ├── JobCard.tsx                     # Card rendering vacancy meta & badges
│       │   └── StatCard.tsx                    # Dashboard metric tile
│       ├── pages/
│       │   ├── LoginPage.tsx                   # Validated sign-in form (useState)
│       │   ├── RegisterPage.tsx                # Validated registration form with role choice
│       │   ├── StudentDashboard.tsx            # Student metrics, applications & recent jobs
│       │   ├── BrowseJobsPage.tsx              # Job directory, filters, and search bar
│       │   ├── AdminDashboard.tsx              # Placement metrics & corporate partners
│       │   └── ManageCompaniesPage.tsx         # Full client-side CRUD table for companies
│       ├── services/
│       │   └── mockData.ts                     # Mock datasets for companies, jobs & applications
│       └── types/
│           ├── Company.ts                      # TypeScript interface
│           ├── Job.ts                          # TypeScript interface
│           ├── Student.ts                      # TypeScript interface
│           └── Application.ts                  # TypeScript interface
├── tools/                                      # Local Apache Maven binary (portable toolchain)
├── app.log                                     # Central application log generated by AppLogger
└── README.md                                   # Root project documentation
```

---

## 4. How to Run Each Sector

### 4.1 Database Setup (MySQL Workbench)
1. Open **MySQL Workbench** and connect to your local MySQL instance (Default port `3306`).
2. Open `Database/schema.sql` (`File` -> `Open SQL Script...`) and execute the script (Lightning bolt icon). This creates the database `placement_management` and all five tables (`users`, `students`, `companies`, `jobs`, `applications`).
3. Open `Database/sample_data.sql` and execute the script to seed 2 admins, 10 student profiles, 5 companies, 10 jobs, and 15 applications.
4. Open `Database/verification_queries.sql` and run the diagnostic queries to verify table counts, foreign keys, and application distributions.

### 4.2 Backend Execution (Java & Spring Boot)
1. Ensure your MySQL credentials in `Backend/src/main/resources/db.properties` match your local MySQL configuration:
   ```properties
   db.url=jdbc:mysql://localhost:3306/placement_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   db.user=root
   db.password=YOUR_MYSQL_PASSWORD
   db.driver=com.mysql.cj.jdbc.Driver
   ```
2. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
3. To compile the backend:
   ```bash
   .\mvnw.cmd compile
   ```
4. To test JDBC connection directly:
   ```bash
   java -cp "target/classes;..\tools\apache-maven-3.9.6\lib\*" com.nexus.placement.util.DBConnectionTest
   ```
5. To test all 5 CompanyDAO CRUD operations:
   ```bash
   java -cp "target/classes;..\tools\apache-maven-3.9.6\lib\*" com.nexus.placement.dao.CompanyDAOTest
   ```
6. To launch the Spring Boot application:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
7. Verify the REST endpoint in your browser or terminal:
   ```bash
   curl http://localhost:8080/api/hello
   ```
   **Expected Response:**
   ```json
   {
     "status": "SUCCESS",
     "system": "NEXUS - Smart Placement and Job Management System",
     "module": "Backend Spring Boot REST API",
     "version": "1.0.0-Week1",
     "message": "NEXUS Placement Management Backend is running smoothly.",
     "timestamp": "2026-11-25T..."
   }
   ```

### 4.3 Frontend Execution (React + Vite)
1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.
5. Accessible routes:
   - `/student/jobs` — Browse Jobs with search, branch filter, and category pills
   - `/student/dashboard` — Student Portal with active applications and metrics
   - `/admin/dashboard` — Placement Administration Analytics
   - `/admin/companies` — Company Management with Add, Edit, Delete CRUD operations
   - `/login` — Account sign-in with email & password validation
   - `/register` — Account registration with role selection (Student / Admin)

---

## 5. Week 1 Scope & Intentional Limitations
In strict adherence to the project roadmap for **Week 1 ONLY**:
- **No Spring Data JPA or Hibernate**: Data access is performed through direct JDBC (`DriverManager`, `PreparedStatement`, `ResultSet`, and DAO pattern) to demonstrate fundamental database programming.
- **Pure Client-Side Frontend Mock**: The React frontend does not make network calls to MySQL or the Java backend; all data operates via TypeScript mock arrays and React `useState`.
- **No Authentication / Authorization Sessions**: Login and register forms perform client-side format and constraint validation without generating JWTs or session cookies.
- **No Job Application Submission Persistence**: Clicking "Apply" shows immediate UX feedback without writing records to the database.
- **Separation of Concerns**: Backend and Frontend function as independent, decoupled layers ready for REST integration in subsequent weeks.
