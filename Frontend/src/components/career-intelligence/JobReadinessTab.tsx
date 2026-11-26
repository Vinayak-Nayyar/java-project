import React, { useState } from 'react';
import { MOCK_JOBS } from '../../services/mockData';
import { useAuth, DEFAULT_MOCK_STUDENT } from '../../context/AuthContext';
import { evaluateJobReadiness } from '../../services/careerIntelligenceService';
import { Badge } from '../Badge';

export const JobReadinessTab: React.FC = () => {
  const { user } = useAuth();
  const student = (user && user.role === 'STUDENT') ? user : DEFAULT_MOCK_STUDENT;

  const [selectedJobId, setSelectedJobId] = useState<number>(MOCK_JOBS[0].id);

  const selectedJob = MOCK_JOBS.find((j) => j.id === selectedJobId) || MOCK_JOBS[0];
  const readiness = evaluateJobReadiness(selectedJob, student);

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Strong Match':
        return 'green';
      case 'Moderate Match':
        return 'yellow';
      default:
        return 'red';
    }
  };

  return (
    <div className="py-2">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-2 border-light">
        <div>
          <span className="badge-pill-yellow mb-2 d-inline-block">Vacancy Compatibility Evaluator</span>
          <h4 className="fw-bolder mb-1 text-dark" style={{ color: '#0F4A37' }}>
            Job Readiness Assessment
          </h4>
          <p className="text-muted small mb-0">
            Discover how closely your profile matches the requirements of available placement opportunities.
          </p>
        </div>
      </div>

      {/* JOB SELECTOR TOOLBAR */}
      <div className="nexus-card p-3 mb-4">
        <label className="form-label fw-bold small text-dark mb-1">
          Select Target Placement Opportunity to Evaluate:
        </label>
        <div className="row g-2 align-items-center">
          <div className="col-md-8">
            <select
              className="form-select nexus-input fw-semibold"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
            >
              {MOCK_JOBS.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.companyName} — {job.title} ({job.location} • ₹{job.salaryPackage} LPA)
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 text-md-end">
            <span className="text-muted small">
              Evaluating against <strong>{MOCK_JOBS.length}</strong> active corporate campus openings
            </span>
          </div>
        </div>
      </div>

      {/* READINESS HERO SCORE CARD */}
      <div className="nexus-card p-4 p-md-5 mb-4">
        <div className="row align-items-center gy-4">
          {/* Score Circle - Enhanced Responsive Circular Match Rating */}
          <div className="col-md-4 text-center border-end-md border-2 border-light d-flex flex-column align-items-center justify-content-center">
            <div
              className="nexus-score-circle mb-3"
              style={{
                backgroundColor:
                  readiness.readinessScore >= 75
                    ? '#dcfce7'
                    : readiness.readinessScore >= 50
                    ? '#fef08a'
                    : '#fee2e2'
              }}
            >
              <span className="circle-value">
                {readiness.readinessScore}%
              </span>
              <span className="circle-label">
                MATCH RATING
              </span>
            </div>
            <div>
              <Badge variant={getCategoryBadgeVariant(readiness.category)}>
                {readiness.category}
              </Badge>
            </div>
          </div>

          {/* Job Overview & Explanation */}
          <div className="col-md-8 ps-md-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 className="fw-bolder mb-0 text-dark">{selectedJob.title}</h5>
                <span className="text-success fw-bold small">🏢 {selectedJob.companyName}</span>
              </div>
              <span className="badge-pill-yellow fw-bold">₹{selectedJob.salaryPackage} LPA</span>
            </div>

            <p className="text-muted small mb-3">{selectedJob.description}</p>

            <div className="p-3 rounded-3 bg-light border border-secondary-subtle small mb-3">
              <strong className="text-dark d-block mb-1">Diagnostic Rationale:</strong>
              <span className="text-muted">{readiness.explanation}</span>
            </div>

            {/* Score points breakdown */}
            <div className="d-flex flex-wrap gap-2 small">
              <span className="badge-pill-green">
                Academic Match: {readiness.scoreBreakdown.academicPoints} / 30 pts
              </span>
              <span className="badge-pill-lilac">
                Skills Match: {readiness.scoreBreakdown.skillsPoints} / 50 pts
              </span>
              <span className="badge-pill-yellow">
                Profile Completeness: {readiness.scoreBreakdown.profileCompletenessPoints} / 20 pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN COMPARISON: SKILLS & ELIGIBILITY */}
      <div className="row g-4">
        {/* Left: Skills Match & Gaps */}
        <div className="col-lg-7">
          <div className="nexus-card p-4 h-100">
            <h6 className="fw-bolder mb-3 text-dark d-flex justify-content-between align-items-center">
              <span>Technical Skills Breakdown</span>
              <span className="small text-muted">{readiness.matchedSkills.length} Matched</span>
            </h6>

            {/* Matched Required Skills */}
            <div className="mb-3">
              <small className="text-muted fw-bold text-uppercase d-block mb-2">
                ✓ Matched Required Skills
              </small>
              <div className="d-flex flex-wrap gap-2">
                {readiness.matchedSkills.length > 0 ? (
                  readiness.matchedSkills.map((s) => (
                    <span key={s} className="badge-pill-green">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-muted small">No direct skill overlap found.</span>
                )}
              </div>
            </div>

            {/* Missing Required Skills */}
            <div className="mb-3">
              <small className="text-muted fw-bold text-uppercase d-block mb-2">
                ⚠️ Missing Core Skills for This Opening
              </small>
              <div className="d-flex flex-wrap gap-2">
                {readiness.missingSkills.length > 0 ? (
                  readiness.missingSkills.map((s) => (
                    <span key={s} className="badge-pill-red">
                      ✕ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-success small fw-semibold">
                    ✓ You possess all required technical skills for this role!
                  </span>
                )}
              </div>
            </div>

            {/* Preferred Skills */}
            {(readiness.preferredSkillsMatched.length > 0 || readiness.preferredSkillsMissing.length > 0) && (
              <div>
                <small className="text-muted fw-bold text-uppercase d-block mb-2">
                  ⭐ Preferred / Bonus Skills
                </small>
                <div className="d-flex flex-wrap gap-2">
                  {readiness.preferredSkillsMatched.map((s) => (
                    <span key={s} className="badge-pill-lilac">
                      ⭐ {s} (Possessed)
                    </span>
                  ))}
                  {readiness.preferredSkillsMissing.map((s) => (
                    <span key={s} className="badge-pill-dark">
                      ○ {s} (Nice-to-have)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Academic Eligibility Criteria */}
        <div className="col-lg-5">
          <div className="nexus-card p-4 h-100">
            <h6 className="fw-bolder mb-3 text-dark">
              Academic & Placement Cut-Offs
            </h6>

            <div className="d-flex flex-column gap-3">
              {/* CGPA Eligibility */}
              <div
                className={`p-3 rounded-3 border-2 border ${
                  readiness.academicEligibility.cgpaEligible
                    ? 'border-success bg-success-subtle'
                    : 'border-danger bg-danger-subtle'
                }`}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold small text-dark">CGPA Cut-Off Check</span>
                  <span className={`badge rounded-pill ${readiness.academicEligibility.cgpaEligible ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                    {readiness.academicEligibility.cgpaEligible ? 'Eligible' : 'Below Cut-Off'}
                  </span>
                </div>
                <div className="small text-muted">
                  Your CGPA: <strong>{readiness.academicEligibility.studentCgpa}</strong> | Minimum Required: <strong>{readiness.academicEligibility.requiredCgpa}</strong>
                </div>
              </div>

              {/* Branch Eligibility */}
              <div
                className={`p-3 rounded-3 border-2 border ${
                  readiness.academicEligibility.branchEligible
                    ? 'border-success bg-success-subtle'
                    : 'border-danger bg-danger-subtle'
                }`}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold small text-dark">Academic Department / Branch</span>
                  <span className={`badge rounded-pill ${readiness.academicEligibility.branchEligible ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                    {readiness.academicEligibility.branchEligible ? 'Branch Approved' : 'Ineligible'}
                  </span>
                </div>
                <div className="small text-muted">
                  Your Branch: <strong>{readiness.academicEligibility.studentBranch}</strong>
                  <br />
                  Permitted Branches: <strong>{readiness.academicEligibility.requiredBranch}</strong>
                </div>
              </div>

              {/* Job Deadline & Location */}
              <div className="p-3 rounded-3 bg-light border border-secondary-subtle small">
                <div className="mb-1">
                  <span className="fw-bold text-dark">Work Location:</span> {selectedJob.location}
                </div>
                <div>
                  <span className="fw-bold text-dark">Application Deadline:</span> {selectedJob.deadline}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
