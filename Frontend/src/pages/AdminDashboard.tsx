import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_ADMIN_STATS, MOCK_COMPANIES, MOCK_APPLICATIONS } from '../services/mockData';
import { StatCard } from '../components/StatCard';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="container py-4">
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom border-2 border-dark">
        <div>
          <span className="badge-pill-yellow mb-2 d-inline-block">Placement Office Console</span>
          <h2 className="fw-bolder mb-0" style={{ color: '#0F4A37' }}>
            Administrative Analytics & Overview
          </h2>
          <p className="text-muted small mb-0">
            Real-time placement drive metrics, student throughput, and corporate relations
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/admin/companies" className="nexus-btn-primary text-decoration-none">
            Manage Companies 🏢
          </Link>
          <Link to="/student/jobs" className="nexus-btn-outline text-decoration-none">
            View Job Listings ↗
          </Link>
        </div>
      </div>

      {/* CORE 4 REQUIRED METRIC STATS */}
      <div className="row mb-4">
        <StatCard
          title="Total Students"
          value={MOCK_ADMIN_STATS.totalStudents}
          subtitle="Registered 2027 graduating batch"
          variant="yellow"
          icon="🎓"
        />
        <StatCard
          title="Corporate Partners"
          value={MOCK_ADMIN_STATS.totalCompanies}
          subtitle="Active visiting recruiters"
          variant="lilac"
          icon="🏢"
        />
        <StatCard
          title="Job Postings"
          value={MOCK_ADMIN_STATS.totalJobs}
          subtitle="Published campus vacancies"
          variant="green"
          icon="💼"
        />
        <StatCard
          title="Total Applications"
          value={MOCK_ADMIN_STATS.totalApplications}
          subtitle="Student applications received"
          variant="white"
          icon="📑"
        />
      </div>

      {/* ADDITIONAL PERFORMANCE ANALYTICS */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="p-3 bg-white rounded-4 border border-2 border-dark" style={{ boxShadow: '3px 3px 0px #1E293B' }}>
            <span className="text-muted small fw-bold">AVG COMPENSATION</span>
            <h3 className="fw-bolder mt-1 text-dark">₹{MOCK_ADMIN_STATS.averagePackage} LPA</h3>
            <span className="badge-pill-green small">Across all offers</span>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="p-3 bg-white rounded-4 border border-2 border-dark" style={{ boxShadow: '3px 3px 0px #1E293B' }}>
            <span className="text-muted small fw-bold">SHORTLISTED CANDIDATES</span>
            <h3 className="fw-bolder mt-1 text-dark">{MOCK_ADMIN_STATS.shortlistedCount}</h3>
            <span className="badge-pill-yellow small">Technical interview rounds</span>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="p-3 bg-white rounded-4 border border-2 border-dark" style={{ boxShadow: '3px 3px 0px #1E293B' }}>
            <span className="text-muted small fw-bold">ACCEPTED OFFERS</span>
            <h3 className="fw-bolder mt-1 text-dark">{MOCK_ADMIN_STATS.acceptedOffers}</h3>
            <span className="badge-pill-lilac small">Early campus placements</span>
          </div>
        </div>
      </div>

      {/* SUMMARY TABLES */}
      <div className="row">
        {/* Left: Active Companies List */}
        <div className="col-lg-6 mb-4">
          <div className="nexus-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bolder mb-0" style={{ color: '#0F4A37' }}>
                Visiting Companies
              </h5>
              <Link to="/admin/companies" className="small fw-bold text-success text-decoration-none">
                Manage All →
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light border-bottom border-2 border-dark">
                  <tr>
                    <th>Company Name</th>
                    <th>Industry</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_COMPANIES.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-bold">{c.name}</td>
                      <td><span className="badge-pill-lilac">{c.industry}</span></td>
                      <td className="text-muted">{c.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Recent Applications Activity */}
        <div className="col-lg-6 mb-4">
          <div className="nexus-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bolder mb-0" style={{ color: '#0F4A37' }}>
                Recent Applications Activity
              </h5>
              <span className="small text-muted">{MOCK_APPLICATIONS.length} Recorded</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light border-bottom border-2 border-dark">
                  <tr>
                    <th>Applicant</th>
                    <th>Company & Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_APPLICATIONS.map((app) => (
                    <tr key={app.id}>
                      <td className="fw-bold">{app.studentName}</td>
                      <td>
                        <div>{app.jobTitle}</div>
                        <small className="text-muted">{app.companyName}</small>
                      </td>
                      <td>
                        <span
                          className={
                            app.status === 'ACCEPTED'
                              ? 'badge-pill-green'
                              : app.status === 'SHORTLISTED'
                              ? 'badge-pill-yellow'
                              : app.status === 'REJECTED'
                              ? 'badge-pill-red'
                              : 'badge-pill-dark'
                          }
                        >
                          {app.status === 'ACCEPTED' && '✓ '}
                          {app.status === 'SHORTLISTED' && '⭐ '}
                          {app.status === 'REJECTED' && '✕ '}
                          {app.status === 'APPLIED' && '⏳ '}
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
