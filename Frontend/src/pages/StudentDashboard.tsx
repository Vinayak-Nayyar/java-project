import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../services/mockData';
import { StatCard } from '../components/StatCard';
import { useAuth, DEFAULT_MOCK_STUDENT } from '../context/AuthContext';
import { CareerIntelligenceSection } from '../components/career-intelligence/CareerIntelligenceSection';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  // Authoritative student profile: uses active logged-in user if STUDENT, else default
  const currentStudent = (user && user.role === 'STUDENT') ? user : DEFAULT_MOCK_STUDENT;

  const studentApplications = MOCK_APPLICATIONS.filter(
    (app) => app.studentId === currentStudent.id || app.studentId === 1
  );
  const recentJobs = MOCK_JOBS.slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="badge-pill-green">✓ Accepted</span>;
      case 'SHORTLISTED':
        return <span className="badge-pill-yellow">⭐ Shortlisted</span>;
      case 'REJECTED':
        return <span className="badge-pill-red">✕ Declined</span>;
      default:
        return <span className="badge-pill-lilac">⏳ Applied</span>;
    }
  };

  return (
    <div className="container py-4">
      {/* WELCOME SECTION */}
      <div
        className="p-4 p-md-5 rounded-4 border border-2 border-dark mb-4 text-white"
        style={{
          backgroundColor: '#0F4A37',
          boxShadow: '4px 4px 0px #1E293B',
          backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(254, 224, 84, 0.15) 0%, transparent 60%)'
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge-pill-yellow text-dark mb-2 d-inline-block">
              Student Placement Portal
            </span>
            <h1 className="fw-bolder mb-1 text-white">
              Welcome back, {currentStudent.name}! 👋
            </h1>
            <p className="text-white-50 mb-3 small">
              Roll No: <strong className="text-white">{currentStudent.rollNumber}</strong> | Branch: <strong className="text-white">{currentStudent.branch}</strong> | Current CGPA: <strong className="text-warning">{currentStudent.cgpa}</strong>
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/student/jobs" className="nexus-btn-primary text-decoration-none">
                Browse Campus Openings ↗
              </Link>
            </div>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0 d-none d-md-block">
            <div
              className="d-inline-block bg-white p-3 rounded-4 border border-2 border-dark text-center text-dark"
              style={{ boxShadow: '3px 3px 0px #1E293B' }}
            >
              <span className="fs-3">📄</span>
              <div className="fw-bold small mt-1 text-truncate" style={{ maxWidth: '180px' }}>
                {currentStudent.resumeFileName || 'Resume on File'}
              </div>
              <span className="badge-pill-green small">Verified Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="row mb-4">
        <StatCard
          title="Available Openings"
          value={MOCK_JOBS.length}
          subtitle="Active campus recruitments"
          variant="yellow"
          icon="💼"
        />
        <StatCard
          title="My Applications"
          value={studentApplications.length}
          subtitle="Positions submitted"
          variant="lilac"
          icon="📋"
        />
        <StatCard
          title="Interviews / Shortlisted"
          value={studentApplications.filter((a) => a.status === 'SHORTLISTED').length}
          subtitle="Action required"
          variant="green"
          icon="🎯"
        />
        <StatCard
          title="Current Standing"
          value={`${currentStudent.cgpa !== undefined ? currentStudent.cgpa : '8.92'} CGPA`}
          subtitle={`Class of ${currentStudent.graduationYear || '2027'}`}
          variant="white"
          icon="🏆"
        />
      </div>

      {/* CAREER INTELLIGENCE SUITE */}
      <CareerIntelligenceSection />

      {/* TWO COLUMN CONTENT: APPLICATION OVERVIEW & RECENT JOBS */}
      <div className="row">
        {/* Left: My Applications Overview */}
            <div className="col-lg-7 mb-4" style={{ minWidth: 0 }}>
              <div className="nexus-card p-4 h-100" style={{ minWidth: 0 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bolder mb-0" style={{ color: '#0F4A37' }}>
                    My Application Overview
                  </h5>
                  <span className="small text-muted">{studentApplications.length} Submitted</span>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom border-2 border-dark small">
                      <tr>
                        <th>Role & Company</th>
                        <th>Package</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentApplications.map((app) => (
                        <tr key={app.id}>
                            <td style={{ minWidth: '160px' }}>
                              <div className="fw-bold text-dark text-break-word">{app.jobTitle}</div>
                              <small className="text-muted text-break-word">{app.companyName}</small>
                            </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                <span className="fw-bold text-dark">₹{app.salaryPackage.toFixed(2)} LPA</span>
                              </td>
                              <td className="small text-muted" style={{ whiteSpace: 'nowrap' }}>{app.appliedDate}</td>
                              <td>{getStatusBadge(app.status)}</td>
                            </tr>
                  ))}
                          </tbody>
                        </table>
            </div>
                </div>
              </div>

              {/* Right: Recommended / Recent Vacancies */}
                  <div className="col-lg-5 mb-4" style={{ minWidth: 0 }}>
                    <div className="nexus-card p-4 h-100" style={{ minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bolder mb-0" style={{ color: '#0F4A37' }}>
                          Featured Opportunities
                        </h5>
                        <Link to="/student/jobs" className="small fw-bold text-success text-decoration-none">
                          View All →
                        </Link>
                      </div>

                        <div className="d-flex flex-column gap-3" style={{ minWidth: 0 }}>
                          {recentJobs.map((job) => (
                            <div
                              key={job.id}
                              className="p-3 rounded-3 border border-2 border-dark"
                              style={{ backgroundColor: '#F8FAF7', minWidth: 0 }}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-1 gap-2 flex-wrap">
                                  <h6 className="fw-bold text-dark mb-0 text-break-word" style={{ maxWidth: '70%' }}>
                                    {job.title}
                                  </h6>
                                  <span className="badge-pill-yellow small">₹{job.salaryPackage} LPA</span>
                                </div>
                                  <div className="small text-muted mb-2 text-break-word">
                                    🏢 {job.companyName} • 📍 {job.location}
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center small flex-wrap gap-1">
                                    <span className="text-muted">Deadline: {job.deadline}</span>
                                    <Link to="/student/jobs" className="fw-bold text-dark text-decoration-none">
                                      Details ↗
                                    </Link>
                                  </div>
                                </div>
              ))}
                              </div>
                            </div>
        </div>
                      </div>
                    </div>
                    );
};
