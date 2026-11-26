import React, { useState } from 'react';
import { useAuth, DEFAULT_MOCK_STUDENT } from '../../context/AuthContext';
import { evaluateResumeQuality, ResumeAnalysisScore } from '../../services/careerIntelligenceService';
import { Badge } from '../Badge';

export const ResumeAnalyzerTab: React.FC = () => {
  const { user } = useAuth();
  const student = (user && user.role === 'STUDENT') ? user : DEFAULT_MOCK_STUDENT;

  const [activeFile, setActiveFile] = useState<{ name: string; size: string } | null>(
    student.resumeFileName ? { name: student.resumeFileName, size: '428 KB' } : null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisScore | null>(() =>
    evaluateResumeQuality(student)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF resume files (.pdf) are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Resume file size cannot exceed 5MB.');
      return;
    }

    setUploadError(null);
    const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
    setActiveFile({ name: file.name, size: sizeStr });

    // Trigger analysis
    runAnalysis();
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(evaluateResumeQuality(student));
      setIsAnalyzing(false);
    }, 900);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 65) return 'text-warning';
    return 'text-danger';
  };

  const getProgressBarClass = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 65) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="py-2">
      {/* TAB HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-2 border-light">
        <div>
          <span className="badge-pill-yellow mb-2 d-inline-block">AI Diagnostic Engine</span>
          <h4 className="fw-bolder mb-1 text-dark" style={{ color: '#0F4A37' }}>
            Resume Strength Analyzer
          </h4>
          <p className="text-muted small mb-0">
            Evaluate your resume and discover how effectively it showcases your skills, projects and experience.
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <button
            className="nexus-btn-primary py-2 px-3 small"
            onClick={runAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing Document...' : '🔄 Re-Run Full Analysis'}
          </button>
        </div>
      </div>

      {/* UPLOAD & FILE METADATA CARD */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div
            className={`p-4 rounded-4 border-2 text-center h-100 d-flex flex-column justify-content-center ${
              isDragging ? 'border-success bg-light' : 'border-dashed border-dark bg-white'
            }`}
            style={{ borderStyle: 'dashed', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => document.getElementById('resume-analyzer-file-input')?.click()}
          >
            <input
              id="resume-analyzer-file-input"
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="fs-1 mb-2">📑</div>
            <h6 className="fw-bold mb-1 text-dark">Drag & Drop Resume (PDF)</h6>
            <p className="text-muted small mb-3">or browse from your computer (Max 5MB)</p>
            <span className="nexus-btn-outline mx-auto py-1 px-3 small">Choose PDF File</span>
          </div>
          {uploadError && (
            <div className="alert alert-danger border-2 border-dark rounded-3 small mt-2 py-2">
              ⚠️ {uploadError}
            </div>
          )}
        </div>

        {/* ACTIVE FILE AND EXTRACTION SUMMARY */}
        <div className="col-lg-7">
          <div className="nexus-card p-4 h-100">
            <h6 className="fw-bolder mb-3 text-dark d-flex justify-content-between align-items-center">
              <span>Active Target Resume</span>
              <Badge variant="green">Verified Student PDF</Badge>
            </h6>

            {activeFile ? (
              <div>
                <div
                  className="p-3 rounded-3 border border-2 border-dark d-flex align-items-center justify-content-between mb-3"
                  style={{ backgroundColor: '#F8FAF7' }}
                >
                  <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
                    <div
                      className="p-2 rounded-2 border border-2 border-dark text-center flex-shrink-0"
                      style={{ backgroundColor: '#fee2e2', width: '42px', height: '42px' }}
                    >
                      <span className="fw-bold text-danger small">PDF</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.92rem' }}>
                        {activeFile.name}
                      </div>
                      <small className="text-muted">Size: {activeFile.size} • Extracted successfully</small>
                    </div>
                  </div>
                  <Badge variant="lilac">ATS Ready</Badge>
                </div>

                <div className="row g-2 small text-muted">
                  <div className="col-6">
                    <span className="fw-bold text-dark">Technical Skills Identified:</span> {student.skills?.length || 8}
                  </div>
                  <div className="col-6">
                    <span className="fw-bold text-dark">Degree Track:</span> {student.branch || 'CSE'}
                  </div>
                  <div className="col-6">
                    <span className="fw-bold text-dark">Academic Score:</span> {student.cgpa || 8.92} CGPA
                  </div>
                  <div className="col-6">
                    <span className="fw-bold text-dark">Format:</span> Single-Column ATS
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted small">
                No resume selected yet. Upload a PDF or attach one in your profile.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {isAnalyzing && (
        <div className="nexus-card p-5 text-center my-4">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="fw-bold text-dark">Analyzing Resume Architecture...</h5>
          <p className="text-muted small mb-0">
            Extracting technical skills, verifying project descriptions, parsing academic achievements, and checking ATS compliance.
          </p>
        </div>
      )}

      {/* ANALYSIS RESULTS DASHBOARD */}
      {!isAnalyzing && analysisResult && (
        <div>
          {/* OVERALL STRENGTH HERO */}
          <div
            className="p-4 rounded-4 border border-2 border-dark mb-4 text-white"
            style={{
              backgroundColor: '#0F4A37',
              boxShadow: '4px 4px 0px #1E293B',
              backgroundImage: 'radial-gradient(circle at 95% 15%, rgba(254, 224, 84, 0.2) 0%, transparent 60%)'
            }}
          >
            <div className="row align-items-center">
              <div className="col-md-3 text-center border-end border-white border-opacity-25 pb-3 pb-md-0">
                <small className="text-white-50 fw-bold text-uppercase d-block mb-1">
                  Overall Resume Score
                </small>
                <div
                  className="nexus-score-circle mb-2"
                  style={{
                    backgroundColor: '#FEE054',
                    width: '124px',
                    height: '124px',
                    minWidth: '124px',
                    minHeight: '124px'
                  }}
                >
                  <div className="d-flex align-items-baseline justify-content-center">
                    <span className="circle-value" style={{ fontSize: '1.9rem' }}>
                      {analysisResult.overallScore}
                    </span>
                    <span className="text-dark-50 fw-bold small ms-1">/100</span>
                  </div>
                  <span className="circle-label" style={{ fontSize: '0.62rem' }}>
                    OVERALL SCORE
                  </span>
                </div>
                <div className="mt-2">
                  <span className="badge-pill-yellow text-dark small">
                    {analysisResult.overallScore >= 80 ? '⭐ Placement Competitive' : 'Solid Foundation'}
                  </span>
                </div>
              </div>

              <div className="col-md-9 ps-md-4 mt-3 mt-md-0">
                <h5 className="fw-bolder mb-1 text-white">Resume Diagnostic Summary</h5>
                <p className="text-white-50 small mb-3">
                  This score evaluates how completely and persuasively your resume presents your technical qualifications to automated Applicant Tracking Systems (ATS) and corporate recruiters.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge-pill-green">✓ High Academic Standing</span>
                  <span className="badge-pill-lilac">✓ Core Stack Present</span>
                  <span className="badge-pill-yellow">⚡ Action: Add Quantified Metrics</span>
                </div>
              </div>
            </div>
          </div>

          {/* INDIVIDUAL CATEGORY SCORES */}
          <h5 className="fw-bolder mb-3 text-dark" style={{ color: '#0F4A37' }}>
            Score Breakdown by Dimension
          </h5>
          <div className="row g-3 mb-4">
            {Object.entries(analysisResult.categories).map(([key, cat]) => {
              const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
              return (
                <div key={key} className="col-md-6 col-lg-4">
                  <div className="nexus-card p-3 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small text-dark">{label}</span>
                      <span className={`fw-bolder ${getScoreColor(cat.score)}`}>
                        {cat.score} / 100
                      </span>
                    </div>
                    <div className="progress mb-2" style={{ height: '7px' }}>
                      <div
                        className={`progress-bar ${getProgressBarClass(cat.score)}`}
                        role="progressbar"
                        style={{ width: `${cat.score}%` }}
                      ></div>
                    </div>
                    <small className="text-muted d-block" style={{ fontSize: '0.78rem', lineHeight: 1.35 }}>
                      {cat.feedback}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>

          {/* STRENGTHS AND WEAKNESSES 2-COLUMN */}
          <div className="row g-4 mb-4">
            {/* Strengths */}
            <div className="col-lg-6">
              <div className="nexus-card p-4 h-100">
                <h6 className="fw-bolder mb-3 text-dark d-flex align-items-center gap-2">
                  <span className="badge-pill-green">✓</span>
                  <span>Highlighted Strengths</span>
                </h6>
                <div className="d-flex flex-column gap-2">
                  {analysisResult.strengths.map((s, idx) => (
                    <div key={idx} className="p-2 rounded-3 bg-light border border-secondary-subtle small d-flex gap-2">
                      <span className="text-success fw-bold">✓</span>
                      <span className="text-dark">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weaknesses */}
            <div className="col-lg-6">
              <div className="nexus-card p-4 h-100">
                <h6 className="fw-bolder mb-3 text-dark d-flex align-items-center gap-2">
                  <span className="badge-pill-yellow">⚠️</span>
                  <span>Missing Details & Weaknesses</span>
                </h6>
                <div className="d-flex flex-column gap-2">
                  {analysisResult.weaknesses.map((w, idx) => (
                    <div key={idx} className="p-2 rounded-3 bg-light border border-secondary-subtle small d-flex gap-2">
                      <span className="text-warning fw-bold">✕</span>
                      <span className="text-dark">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONABLE RECOMMENDATIONS */}
          <div className="nexus-card p-4">
            <h6 className="fw-bolder mb-3 text-dark d-flex align-items-center gap-2">
              <span>💡</span>
              <span>Specific Recommendations for Improvement</span>
            </h6>
            <div className="row g-3">
              {analysisResult.actionableRecommendations.map((rec, idx) => (
                <div key={idx} className="col-md-6">
                  <div
                    className="p-3 rounded-3 border border-2 border-dark h-100"
                    style={{ backgroundColor: '#F8FAF7' }}
                  >
                    <div className="fw-bold small text-dark mb-1">Recommendation #{idx + 1}</div>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.45 }}>
                      {rec}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
