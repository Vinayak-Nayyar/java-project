import React, { useState } from 'react';
import { useAuth, DEFAULT_MOCK_STUDENT } from '../../context/AuthContext';
import {
  TARGET_ROLES,
  evaluateSkillGaps
} from '../../services/careerIntelligenceService';
import { Badge } from '../Badge';

interface SkillGapAnalysisTabProps {
  onSelectRoleForRoadmap?: (roleId: string) => void;
}

export const SkillGapAnalysisTab: React.FC<SkillGapAnalysisTabProps> = ({
  onSelectRoleForRoadmap
}) => {
  const { user } = useAuth();
  const student = (user && user.role === 'STUDENT') ? user : DEFAULT_MOCK_STUDENT;

  const [selectedRoleId, setSelectedRoleId] = useState<string>(TARGET_ROLES[0].id);

  const roleResult = evaluateSkillGaps(selectedRoleId, student);
  const activeRole = TARGET_ROLES.find((r) => r.id === selectedRoleId) || TARGET_ROLES[0];

  return (
    <div className="py-2">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-2 border-light">
        <div>
          <span className="badge-pill-yellow mb-2 d-inline-block">Curriculum Gap Analysis</span>
          <h4 className="fw-bolder mb-1 text-dark" style={{ color: '#0F4A37' }}>
            Skill Gap Identification
          </h4>
          <p className="text-muted small mb-0">
            Identify the skills you're missing and understand what you need to learn for your target career.
          </p>
        </div>
      </div>

      {/* TARGET ROLE SELECTION PILLS */}
      <div className="nexus-card p-3 p-md-4 mb-4">
        <label className="form-label fw-bold small text-dark mb-2">
          Select Your Target Career Path:
        </label>
        <div className="d-flex flex-wrap gap-2">
          {TARGET_ROLES.map((role) => {
            const isSelected = role.id === selectedRoleId;
            return (
              <button
                key={role.id}
                type="button"
                className={`py-2 px-3 rounded-pill fw-bold small border border-2 border-dark transition ${isSelected
                  ? 'bg-warning text-dark shadow-sm'
                  : 'bg-white text-dark hover-light'
                  }`}
                style={{
                  boxShadow: isSelected ? '2px 2px 0px #1E293B' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedRoleId(role.id)}
              >
                {role.title}
              </button>
            );
          })}
        </div>
        <p className="text-muted small mt-3 mb-0" style={{ maxWidth: '650px' }}>
          {activeRole.description}
        </p>
      </div>

      {/* GAP COVERAGE HERO BAR */}
      <div
        className="p-4 rounded-4 border border-2 border-dark mb-4 bg-white"
        style={{ boxShadow: '4px 4px 0px #1E293B' }}
      >
        <div className="row align-items-center gy-3">
          <div className="col-md-7">
            <span className="badge-pill-lilac mb-1">Target Role Preparedness</span>
            <h5 className="fw-bolder mb-1 text-dark">
              {roleResult.roleTitle} Readiness Rating
            </h5>
            <p className="text-muted small mb-0">
              You currently satisfy <strong>{roleResult.gapCoveragePercent}%</strong> of the combined required and preferred skills for this position.
            </p>
          </div>
          <div className="col-md-5">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small fw-bold text-dark">Skill Coverage</span>
              <span className="fw-bolder text-success fs-5">{roleResult.gapCoveragePercent}%</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${roleResult.gapCoveragePercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE COLUMN SKILL CATEGORIZATION */}
      <div className="row g-4 mb-4">
        {/* 1. Strong Skills */}
        <div className="col-lg-4" style={{ minWidth: 0 }}>
          <div className="nexus-card p-4 h-100" style={{ minWidth: 0 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bolder mb-0 text-dark">
                ✓ Strong Skills
              </h6>
              <Badge variant="green">{roleResult.strongSkills.length}</Badge>
            </div>
            <p className="text-muted small mb-3">
              Skills in your profile that directly satisfy core job requirements.
            </p>
            <div className="d-flex flex-wrap gap-2">
              {roleResult.strongSkills.length > 0 ? (
                roleResult.strongSkills.map((s) => (
                  <span key={s.name} className="badge-pill-green">
                    ✓ {s.name}
                  </span>
                ))
              ) : (
                <span className="text-muted small">No direct strong skills recorded.</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Skills to Improve */}
        <div className="col-lg-4" style={{ minWidth: 0 }}>
          <div className="nexus-card p-4 h-100" style={{ minWidth: 0 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bolder mb-0 text-dark">
                ⚡ Skills to Expand
              </h6>
              <Badge variant="yellow">{roleResult.skillsToImprove.length}</Badge>
            </div>
            <p className="text-muted small mb-3">
              Identified in profile; recommended to advance from foundational to production level.
            </p>
            <div className="d-flex flex-wrap gap-2">
              {roleResult.skillsToImprove.length > 0 ? (
                roleResult.skillsToImprove.map((s) => (
                  <span key={s.name} className="badge-pill-yellow">
                    ⭐ {s.name}
                  </span>
                ))
              ) : (
                <span className="text-muted small">No intermediate tooling tagged.</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Missing Skills */}
        <div className="col-lg-4" style={{ minWidth: 0 }}>
          <div className="nexus-card p-4 h-100" style={{ minWidth: 0 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bolder mb-0 text-dark">
                ⚠️ Critical Missing Skills
              </h6>
              <Badge variant="red">{roleResult.missingSkills.length}</Badge>
            </div>
            <p className="text-muted small mb-3">
              High-priority competencies expected by top corporate interview panels.
            </p>
            <div className="d-flex flex-wrap gap-2">
              {roleResult.missingSkills.length > 0 ? (
                roleResult.missingSkills.map((s) => (
                  <span key={s.name} className="badge-pill-red">
                    ✕ {s.name}
                  </span>
                ))
              ) : (
                <span className="text-success small fw-bold">✓ Zero missing skills!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WHY EACH MISSING SKILL MATTERS (DETAILED CARDS) */}
      {roleResult.missingSkills.length > 0 && (
        <div className="nexus-card p-4 mb-4" style={{ minWidth: 0 }}>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h6 className="fw-bolder mb-0 text-dark d-flex align-items-center gap-2">
              <span>🎯</span>
              <span>Why These Missing Skills Matter for {roleResult.roleTitle}</span>
            </h6>
            {onSelectRoleForRoadmap && (
              <button
                className="nexus-btn-primary py-1 px-3 small flex-shrink-0"
                onClick={() => onSelectRoleForRoadmap(selectedRoleId)}
              >
                Generate Custom Roadmap ↗
              </button>
            )}
          </div>

          <div className="row g-3">
            {roleResult.missingSkills.map((skill) => (
              <div key={skill.name} className="col-md-6">
                <div
                  className="p-3 rounded-3 border border-2 border-dark h-100"
                  style={{ backgroundColor: '#F8FAF7' }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="fw-bold text-dark">{skill.name}</span>
                    <Badge variant={skill.importance === 'Critical' ? 'red' : 'yellow'}>
                      {skill.importance} Priority
                    </Badge>
                  </div>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.45 }}>
                    {skill.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
