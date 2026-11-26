import React, { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/jobService';
import { JobCard } from '../components/JobCard';
import { Job } from '../types/Job';

export const BrowseJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await jobService.getJobs({
        search: searchTerm,
        branch: selectedBranch,
        category: activeCategory || undefined
      });
      setJobs(data);
    } catch (err: any) {
      console.error('[BrowseJobsPage] Error loading jobs:', err);
      setFetchError(err.message || 'Failed to load jobs from Spring Boot backend.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedBranch, activeCategory]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApply = (job: Job) => {
    setToastMessage(`Application submitted for "${job.title}" at ${job.companyName || 'Corporate Partner'}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('ALL');
    setActiveCategory(null);
  };

  return (
    <div className="container py-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="alert alert-success border-2 border-dark rounded-3 position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg"
          style={{ zIndex: 1050, maxWidth: '90%' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span>✓</span>
            <span className="fw-semibold small">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* HERO SECTION MATCHING DESIGN MOCKUP */}
      <div className="row align-items-center mb-5 pt-3">
            <div className="col-lg-7" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <span className="badge-pill-yellow">🚀 Placement Season 2026-27 Active</span>
                <span className="badge-pill-green">Connected to Spring Boot</span>
              </div>
              <h1
                className="fw-bolder mb-3"
                style={{
                  color: '#0F4A37',
                  letterSpacing: '-1px',
                  lineHeight: 1.15,
                  fontSize: 'clamp(2.1rem, 4.8vw, 3.25rem)'
                }}
              >
                Discover a job <br />that suits you!
              </h1>
              <p className="lead text-muted mb-4 fs-6" style={{ maxWidth: '520px' }}>
                Thousands of opportunities from global to local technology companies are waiting for you.
                Explore verified vacancies and kickstart your career.
              </p>

              {/* Search Bar matching Reference UI */}
              <div
                className="p-2 bg-white rounded-4 rounded-sm-pill border border-2 border-dark d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 mb-4"
                style={{ boxShadow: '4px 4px 0px #1E293B', maxWidth: '560px', minWidth: 0 }}
              >
                  <div className="px-3 border-end-sm border-2 border-secondary-subtle">
                    <select
                      className="form-select border-0 bg-transparent fw-bold small p-0"
                      style={{ minWidth: '110px', boxShadow: 'none' }}
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                      <option value="ALL">All Branches</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="MECH">MECH</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent small px-2"
                    placeholder="Search by job title, company, or city..."
                    style={{ boxShadow: 'none', minWidth: 0 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    className="btn rounded-circle d-none d-sm-flex align-items-center justify-content-center p-2 border border-2 border-dark"
                    style={{ backgroundColor: '#DDD6FE', width: '42px', height: '42px', flexShrink: 0 }}
                    onClick={fetchJobs}
                    title="Search Opportunities"
                  >
                    🔍
                  </button>
                  <button
                    className="btn btn-dark d-sm-none w-100 rounded-pill py-2 fw-bold small"
                    onClick={fetchJobs}
                  >
                    🔍 Search Openings
                  </button>
                </div>
              </div>

              {/* Hero Graphic / Badge Card */}
              <div className="col-lg-5 text-center d-none d-lg-block">
                <div
                  className="p-5 rounded-4 border border-2 border-dark position-relative"
                  style={{ backgroundColor: '#e8f5ec', boxShadow: '6px 6px 0px #1E293B' }}
                >
                  <div className="fs-1 mb-2">👨‍💻 👩‍💼 🧑‍🔬</div>
                  <h4 className="fw-bolder" style={{ color: '#0F4A37' }}>
                    Connect with 50+ Top Recruiters
                  </h4>
                  <p className="text-muted small mb-3">
                    Direct campus recruitment drives, verified roles, and streamlined application tracking.
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge-pill-yellow">Highest: ₹22.0 LPA</span>
                    <span className="badge-pill-lilac">Avg: ₹13.0 LPA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK CATEGORY PILLS (MATCHING MOCKUP BOTTOM BAR) */}
            <div className="row g-3 mb-5">
              <div className="col-md-4">
                <div
                  className={`p-3 border border-2 border-dark rounded-4 d-flex justify-content-between align-items-center ${activeCategory === 'Remote' ? 'border-success border-3 shadow' : ''
                    }`}
                  style={{ backgroundColor: '#DDD6FE', boxShadow: '3px 3px 0px #1E293B', cursor: 'pointer' }}
                  onClick={() => setActiveCategory(activeCategory === 'Remote' ? null : 'Remote')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="fs-3">💻</span>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">Remote Jobs</h6>
                      <small className="text-muted">Work from anywhere</small>
                    </div>
                  </div>
                  <span className="fs-4 fw-bold">↙</span>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className={`p-3 border border-2 border-dark rounded-4 d-flex justify-content-between align-items-center ${activeCategory === 'HighPackage' ? 'border-success border-3 shadow' : ''
                    }`}
                  style={{ backgroundColor: '#FEE054', boxShadow: '3px 3px 0px #1E293B', cursor: 'pointer' }}
                  onClick={() => setActiveCategory(activeCategory === 'HighPackage' ? null : 'HighPackage')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="fs-3">⚡</span>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">Dream Packages</h6>
                      <small className="text-muted">₹14+ LPA vacancies</small>
                    </div>
                  </div>
                  <span className="fs-4 fw-bold">↙</span>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className={`p-3 border border-2 border-dark rounded-4 d-flex justify-content-between align-items-center ${activeCategory === 'Internship' ? 'border-success border-3 shadow' : ''
                    }`}
                  style={{ backgroundColor: '#DDD6FE', boxShadow: '3px 3px 0px #1E293B', cursor: 'pointer' }}
                  onClick={() => setActiveCategory(activeCategory === 'Internship' ? null : 'Internship')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="fs-3">⏱️</span>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">Internships</h6>
                      <small className="text-muted">Summer & winter pre-placement</small>
                    </div>
                  </div>
                  <span className="fs-4 fw-bold">↙</span>
                </div>
              </div>
            </div>

            {/* JOBS GRID HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bolder mb-0" style={{ color: '#0F4A37' }}>
                  Available Openings ({jobs.length})
                </h3>
                <p className="text-muted small mb-0">
                  {isLoading ? 'Fetching vacancies from backend...' : 'Showing latest verified campus job postings'}
                </p>
              </div>
              <div className="d-flex gap-2">
                {activeCategory && (
                  <button
                    className="btn btn-sm btn-outline-dark rounded-pill fw-bold"
                    onClick={() => setActiveCategory(null)}
                  >
                    Reset Category ✕
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-dark rounded-pill fw-bold"
                  onClick={fetchJobs}
                  disabled={isLoading}
                >
                  {isLoading ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              </div>
            </div>

            {/* ERROR BANNER */}
            {fetchError && (
              <div className="alert alert-warning border-2 border-dark rounded-3 mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <strong>Backend Connection Note:</strong> {fetchError}
                </div>
                <button className="btn btn-sm btn-dark rounded-pill fw-bold" onClick={fetchJobs}>
                  Retry
                </button>
              </div>
            )}

            {/* RENDER JOB CARDS */}
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success mb-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="text-muted small">Loading opportunities from database...</div>
              </div>
            ) : (
              <div className="row">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard key={job.id} job={job} onApplyClick={handleApply} />
                  ))
                ) : (
                  <div className="col-12 py-5 text-center">
                    <div className="p-5 nexus-card bg-white">
                      <span className="fs-1">🔍</span>
                      <h5 className="fw-bold mt-3">No matching vacancies found</h5>
                      <p className="text-muted small">
                        Try clearing search filters or selecting 'All Branches'.
                      </p>
                      <button
                        className="nexus-btn-primary py-2 px-4 small"
                        onClick={handleResetFilters}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          );
};
