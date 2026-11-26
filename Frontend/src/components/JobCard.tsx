import React from 'react';
import { Job } from '../types/Job';

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApplyClick }) => {
  return (
    <div className="col-lg-6 col-xl-4 mb-4" style={{ minWidth: 0 }}>
      <div className="nexus-card h-100 p-4 d-flex flex-column justify-content-between" style={{ minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          {/* Header Row: Company & Job Type */}
          <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
            <span className="badge-pill-lilac">{job.jobType}</span>
            <span className="badge-pill-yellow fw-bold">₹{job.salaryPackage.toFixed(2)} LPA</span>
          </div>

          {/* Job Title and Company */}
          <h5
            className="fw-bold mb-1 text-dark"
            style={{ minHeight: '2.8rem', overflowWrap: 'break-word', wordBreak: 'break-word' }}
          >
            {job.title}
          </h5>
          <p className="text-success fw-bold small mb-3 text-truncate" title={job.companyName}>
            🏢 {job.companyName}
          </p>

          <p
            className="text-muted small mb-3"
            style={{
              minHeight: '3.2rem',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              lineHeight: 1.5
            }}
          >
            {job.description}
          </p>

          {/* Key Meta Information Badges */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge-pill-green">
              📍 {job.location}
            </span>
            <span className="badge-pill-lilac">
              🎓 Min {job.minCgpa} CGPA
            </span>
            <span className="badge-pill-yellow">
              📚 {job.eligibleBranch}
            </span>
          </div>
        </div>

        {/* Footer: Deadline and Action */}
        <div className="pt-3 border-top border-2 border-light d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="small text-muted">
            <span className="fw-semibold">Deadline:</span> {job.deadline}
          </div>
          <button
            className="nexus-btn-primary py-2 px-3 small flex-shrink-0"
            onClick={() => onApplyClick && onApplyClick(job)}
          >
            Apply Now ↗
          </button>
        </div>
      </div>
    </div>
  );
};
