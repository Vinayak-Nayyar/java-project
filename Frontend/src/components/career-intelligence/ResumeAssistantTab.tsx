import React, { useState } from 'react';
import { useAuth, DEFAULT_MOCK_STUDENT } from '../../context/AuthContext';

export interface ResumeSuggestion {
  id: string;
  category: 'writing' | 'ats' | 'grammar' | 'job';
  categoryLabel: string;
  originalText: string;
  improvedText: string;
  explanation: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const DEFAULT_SUGGESTIONS: ResumeSuggestion[] = [
  {
    id: 'sug-1',
    category: 'writing',
    categoryLabel: 'Writing Improvements',
    originalText: 'Responsible for creating a student placement web application using React and Spring Boot.',
    improvedText: 'Architected an enterprise placement management portal using React 18 and Spring Boot 3, reducing query response latencies by 35% across 500+ student records.',
    explanation: 'Replaces passive responsibility phrasing ("Responsible for creating") with a strong technical action verb ("Architected") and attaches quantifiable results (35% latency reduction, 500+ records).',
    status: 'pending'
  },
  {
    id: 'sug-2',
    category: 'ats',
    categoryLabel: 'ATS Keyword Optimization',
    originalText: 'Handled data storage and writing queries for database operations.',
    improvedText: 'Engineered 3NF relational schemas in MySQL 8.0 enforcing referential integrity, indexed foreign keys, and ACID-compliant transaction boundaries.',
    explanation: 'Injects critical recruiter ATS keywords: "3NF relational schemas", "MySQL 8.0", "referential integrity", and "ACID-compliant transactions".',
    status: 'pending'
  },
  {
    id: 'sug-3',
    category: 'grammar',
    categoryLabel: 'Grammar and Clarity',
    originalText: 'I had helped my team members in fixing multiple bugs and written test cases for our backend endpoints.',
    improvedText: 'Collaborated with engineering peers to resolve 15+ backend defects and authored comprehensive JUnit 5 integration test suites achieving 92% code coverage.',
    explanation: 'Corrects awkward past-perfect tense ("had helped... and written"), removes first-person pronouns, and specifies measurable testing coverage.',
    status: 'pending'
  },
  {
    id: 'sug-4',
    category: 'job',
    categoryLabel: 'Job-Specific Tailoring',
    originalText: 'Familiar with distributed systems, cloud computing, and basic Docker usage.',
    improvedText: 'Containerized microservices using Docker Compose and automated CI/CD build pipelines deployed to cloud infrastructure with health monitoring.',
    explanation: 'Tailors technical qualifications directly to enterprise Software Engineer and Cloud Developer specifications by demonstrating containerization and automated deployments.',
    status: 'pending'
  }
];

export const ResumeAssistantTab: React.FC = () => {
  const { user } = useAuth();
  const student = (user && user.role === 'STUDENT') ? user : DEFAULT_MOCK_STUDENT;

  // View state: 'initial' | 'analyzing' | 'results'
  const [viewState, setViewState] = useState<'initial' | 'analyzing' | 'results'>('initial');

  // Resume File State
  const [activeFile, setActiveFile] = useState<{ name: string; size: string } | null>(
    student.resumeFileName ? { name: student.resumeFileName, size: '428 KB' } : null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Selected Categories (all selected by default)
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    writing: true,
    ats: true,
    grammar: true,
    job: true
  });

  // Suggestions state
  const [suggestions, setSuggestions] = useState<ResumeSuggestion[]>(DEFAULT_SUGGESTIONS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Toggle category checkbox
  const toggleCategory = (key: string) => {
    setSelectedCategories((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Ensure at least one category remains selected
      if (!Object.values(next).some(Boolean)) {
        return prev;
      }
      return next;
    });
  };

  // Handle PDF Upload
  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please upload a valid PDF document (.pdf only).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Resume file size cannot exceed 5MB.');
      return;
    }

    setUploadError(null);
    const sizeKb = Math.round(file.size / 1024);
    setActiveFile({
      name: file.name,
      size: `${sizeKb} KB`
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Trigger Analysis
  const handleStartAnalysis = () => {
    setViewState('analyzing');
    setTimeout(() => {
      // Filter suggestions based on selected categories
      const activeKeys = Object.keys(selectedCategories).filter((k) => selectedCategories[k]);
      const filtered = DEFAULT_SUGGESTIONS.filter((s) => activeKeys.includes(s.category)).map((s) => ({
        ...s,
        status: 'pending' as const
      }));
      setSuggestions(filtered);
      setViewState('results');
    }, 1200);
  };

  // Accept / Reject Handlers
  const handleAccept = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'accepted' } : s))
    );
  };

  const handleReject = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
  };

  const handleUndo = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'pending' } : s))
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Download Updated Resume
  const handleDownload = () => {
    const acceptedList = suggestions.filter((s) => s.status === 'accepted');
    const content = [
      `============================================================`,
      `NEXUS RESUME ASSISTANT – UPDATED BULLET POINTS`,
      `Student: ${student.name} (${student.rollNumber || 'CS202301'})`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `============================================================\n`,
      acceptedList.length > 0
        ? `ACCEPTED IMPROVEMENTS (${acceptedList.length}):\n` +
          acceptedList
            .map(
              (s, i) =>
                `[${i + 1}] [${s.categoryLabel.toUpperCase()}]\n` +
                `✓ REVISED: ${s.improvedText}\n` +
                `  Original: ${s.originalText}\n` +
                `  Why: ${s.explanation}\n`
            )
            .join('\n')
        : `ALL SUGGESTIONS (None accepted yet):\n` +
          suggestions
            .map(
              (s, i) =>
                `[${i + 1}] [${s.categoryLabel.toUpperCase()}]\n` +
                `✓ REVISED: ${s.improvedText}\n` +
                `  Original: ${s.originalText}\n`
            )
            .join('\n')
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(student.name || 'Student').replace(/\s+/g, '_')}_Updated_Resume_Bullets.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice('✓ Downloaded updated resume bullets.');
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  // Filtered list for display
  const displayedSuggestions =
    activeFilter === 'all'
      ? suggestions
      : suggestions.filter((s) => s.category === activeFilter);

  const acceptedCount = suggestions.filter((s) => s.status === 'accepted').length;

  return (
    <div className="resume-assistant-clean py-2" style={{ minWidth: 0 }}>
      {/* ============================================================
          VIEW 1: INITIAL CLEAN SETUP PAGE
          ============================================================ */}
      {viewState === 'initial' && (
        <div className="mx-auto" style={{ maxWidth: '820px' }}>
          {/* 1. HEADING & SUPPORTING DESCRIPTION */}
          <div className="text-center mb-4">
            <span className="badge-pill-yellow mb-2 d-inline-block">AI Writing Assistant</span>
            <h2 className="fw-bolder mb-2 text-dark" style={{ color: '#0F4A37', letterSpacing: '-0.5px' }}>
              Improve your resume.
            </h2>
            <p className="text-muted small mx-auto mb-0" style={{ maxWidth: '580px', lineHeight: 1.6 }}>
              Enhance your resume using targeted AI suggestions to sharpen bullet points, inject industry keywords, correct grammar, and maximize campus placement readiness.
            </p>
          </div>

          {/* 2. COMPACT PDF RESUME UPLOAD AREA */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-dark mb-2 d-flex justify-content-between align-items-center">
              <span>Resume Document (PDF)</span>
              {activeFile && <span className="text-success small fw-semibold">✓ Document Attached</span>}
            </label>

            {activeFile ? (
              <div
                className="p-3 rounded-4 border border-2 border-dark d-flex align-items-center justify-content-between bg-white"
                style={{ boxShadow: '3px 3px 0px #1E293B', minWidth: 0 }}
              >
                <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
                  <div
                    className="p-2 rounded-3 border border-2 border-dark d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ backgroundColor: '#fee2e2', width: '42px', height: '42px' }}
                  >
                    <span className="fw-bolder text-danger small">PDF</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.92rem' }}>
                      {activeFile.name}
                    </div>
                    <small className="text-muted">{activeFile.size} • Ready for analysis</small>
                  </div>
                </div>

                <label
                  className="btn btn-sm btn-outline-dark rounded-pill fw-bold px-3 flex-shrink-0 ms-2"
                  style={{ cursor: 'pointer' }}
                >
                  Change File
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="d-none"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`p-4 rounded-4 border border-2 text-center transition-all ${
                  isDragging ? 'border-success bg-success-subtle' : 'border-dark bg-white'
                }`}
                style={{
                  borderStyle: isDragging ? 'dashed' : 'solid',
                  boxShadow: '3px 3px 0px #1E293B'
                }}
              >
                <span className="fs-2 d-block mb-1">📄</span>
                <p className="fw-bold text-dark mb-1 small">Drag and drop your resume PDF here</p>
                <p className="text-muted small mb-3" style={{ fontSize: '0.78rem' }}>
                  Supported format: PDF up to 5MB
                </p>
                <label className="btn btn-sm btn-outline-dark rounded-pill fw-bold px-4" style={{ cursor: 'pointer' }}>
                  Choose PDF File
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="d-none"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}

            {uploadError && (
              <div className="alert alert-danger border-2 border-dark rounded-3 py-2 small mt-2 mb-0">
                ⚠️ {uploadError}
              </div>
            )}
          </div>

          {/* 3. FOUR SELECTABLE IMPROVEMENT CATEGORIES */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-dark mb-2">
              Select Improvement Categories:
            </label>
            <div className="row g-3">
              {/* Category 1: Writing Improvements */}
              <div className="col-sm-6">
                <div
                  onClick={() => toggleCategory('writing')}
                  className="p-3 rounded-4 border border-2 border-dark d-flex align-items-start gap-3 h-100 cursor-pointer transition-all"
                  style={{
                    backgroundColor: selectedCategories.writing ? '#F0FDF4' : '#FFFFFF',
                    boxShadow: selectedCategories.writing ? '3px 3px 0px #1E293B' : '2px 2px 0px #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.writing}
                    onChange={() => toggleCategory('writing')}
                    className="form-check-input mt-1 border-dark flex-shrink-0"
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-bold text-dark small mb-1">✍️ Writing Improvements</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                      Improve descriptions and bullet points with strong action verbs and quantified impact metrics.
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 2: ATS Keyword Optimization */}
              <div className="col-sm-6">
                <div
                  onClick={() => toggleCategory('ats')}
                  className="p-3 rounded-4 border border-2 border-dark d-flex align-items-start gap-3 h-100 cursor-pointer transition-all"
                  style={{
                    backgroundColor: selectedCategories.ats ? '#F0FDF4' : '#FFFFFF',
                    boxShadow: selectedCategories.ats ? '3px 3px 0px #1E293B' : '2px 2px 0px #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.ats}
                    onChange={() => toggleCategory('ats')}
                    className="form-check-input mt-1 border-dark flex-shrink-0"
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-bold text-dark small mb-1">🎯 ATS Keyword Optimization</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                      Identify and improve relevant keywords that automated screening systems search for.
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 3: Grammar and Clarity */}
              <div className="col-sm-6">
                <div
                  onClick={() => toggleCategory('grammar')}
                  className="p-3 rounded-4 border border-2 border-dark d-flex align-items-start gap-3 h-100 cursor-pointer transition-all"
                  style={{
                    backgroundColor: selectedCategories.grammar ? '#F0FDF4' : '#FFFFFF',
                    boxShadow: selectedCategories.grammar ? '3px 3px 0px #1E293B' : '2px 2px 0px #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.grammar}
                    onChange={() => toggleCategory('grammar')}
                    className="form-check-input mt-1 border-dark flex-shrink-0"
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-bold text-dark small mb-1">🔍 Grammar and Clarity</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                      Correct grammar, eliminate passive phrasing, and improve overall readability for recruiters.
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 4: Job-Specific Tailoring */}
              <div className="col-sm-6">
                <div
                  onClick={() => toggleCategory('job')}
                  className="p-3 rounded-4 border border-2 border-dark d-flex align-items-start gap-3 h-100 cursor-pointer transition-all"
                  style={{
                    backgroundColor: selectedCategories.job ? '#F0FDF4' : '#FFFFFF',
                    boxShadow: selectedCategories.job ? '3px 3px 0px #1E293B' : '2px 2px 0px #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.job}
                    onChange={() => toggleCategory('job')}
                    className="form-check-input mt-1 border-dark flex-shrink-0"
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-bold text-dark small mb-1">💼 Job-Specific Tailoring</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                      Improve resume content for technical roles using relevant details within your resume.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. PROMINENT ANALYZE BUTTON */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleStartAnalysis}
              className="nexus-btn-primary px-5 py-3 fs-6"
              style={{
                boxShadow: '4px 4px 0px #1E293B'
              }}
            >
              🚀 Analyze My Resume
            </button>
            <div className="text-muted small mt-2" style={{ fontSize: '0.75rem' }}>
              Instant AI analysis • Generates actionable before/after rewrites
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 2: ANALYZING STATE
          ============================================================ */}
      {viewState === 'analyzing' && (
        <div className="text-center py-5 my-4">
          <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Analyzing...</span>
          </div>
          <h4 className="fw-bolder text-dark mb-1">Analyzing Your Resume</h4>
          <p className="text-muted small mb-0">
            Evaluating bullet points, checking ATS keywords, and formulating recommendations...
          </p>
        </div>
      )}

      {/* ============================================================
          VIEW 3: RESULTS PAGE
          ============================================================ */}
      {viewState === 'results' && (
        <div className="mx-auto" style={{ maxWidth: '860px', minWidth: 0 }}>
          {/* Header & Concise Summary */}
          <div
            className="p-3 p-md-4 rounded-4 border border-2 border-dark mb-4 bg-white d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
            style={{ boxShadow: '3px 3px 0px #1E293B', minWidth: 0 }}
          >
            <div style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span className="badge-pill-yellow small">Analysis Complete</span>
                <span className="badge-pill-green small">
                  {acceptedCount} of {suggestions.length} Accepted
                </span>
              </div>
              <h4 className="fw-bolder mb-0 text-dark" style={{ color: '#0F4A37' }}>
                Suggested Improvements
              </h4>
              <p className="text-muted small mb-0 mt-1">
                Review, accept or reject each suggestion below, then download your updated resume.
              </p>
            </div>

            <div className="d-flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                className="nexus-btn-primary px-3 py-2 small"
                title="Download updated resume bullet points"
              >
                📥 Download Updated Resume
              </button>
              <button
                type="button"
                onClick={() => setViewState('initial')}
                className="btn btn-sm btn-outline-dark rounded-pill fw-bold px-3"
              >
                🔄 Re-analyze
              </button>
            </div>
          </div>

          {downloadNotice && (
            <div className="alert alert-success border-2 border-dark rounded-3 small py-2 mb-3">
              {downloadNotice}
            </div>
          )}

          {/* Filter Pills */}
          <div className="d-flex gap-1 flex-wrap mb-3 pb-1 border-bottom border-light">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-bold small ${
                activeFilter === 'all' ? 'btn-dark' : 'btn-outline-dark'
              }`}
            >
              All ({suggestions.length})
            </button>
            {['writing', 'ats', 'grammar', 'job'].map((cat) => {
              const count = suggestions.filter((s) => s.category === cat).length;
              if (count === 0) return null;
              const labels: Record<string, string> = {
                writing: 'Writing',
                ats: 'ATS Keywords',
                grammar: 'Grammar',
                job: 'Tailoring'
              };
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-bold small ${
                    activeFilter === cat ? 'btn-dark' : 'btn-outline-dark'
                  }`}
                >
                  {labels[cat]} ({count})
                </button>
              );
            })}
          </div>

          {/* List of Suggestions */}
          <div className="d-flex flex-column gap-3 mb-4" style={{ minWidth: 0 }}>
            {displayedSuggestions.map((sug) => {
              const isAccepted = sug.status === 'accepted';
              const isRejected = sug.status === 'rejected';

              return (
                <div
                  key={sug.id}
                  className="p-3 p-md-4 rounded-4 border border-2 border-dark transition-all"
                  style={{
                    backgroundColor: isAccepted ? '#F0FDF4' : isRejected ? '#F8FAFC' : '#FFFFFF',
                    boxShadow: '3px 3px 0px #1E293B',
                    opacity: isRejected ? 0.65 : 1,
                    minWidth: 0
                  }}
                >
                  {/* Top Bar: Category & Status / Controls */}
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <span className="badge-pill-lilac small">
                      {sug.categoryLabel}
                    </span>

                    {/* Accept / Reject Controls */}
                    <div className="d-flex align-items-center gap-2">
                      {isAccepted ? (
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge-pill-green fw-bold small">✓ Accepted</span>
                          <button
                            type="button"
                            onClick={() => handleUndo(sug.id)}
                            className="btn btn-sm btn-link text-muted p-0 small text-decoration-none"
                            style={{ fontSize: '0.78rem' }}
                          >
                            Undo
                          </button>
                        </div>
                      ) : isRejected ? (
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge-pill-red fw-bold small">✕ Rejected</span>
                          <button
                            type="button"
                            onClick={() => handleUndo(sug.id)}
                            className="btn btn-sm btn-link text-muted p-0 small text-decoration-none"
                            style={{ fontSize: '0.78rem' }}
                          >
                            Undo
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleAccept(sug.id)}
                            className="btn btn-sm btn-success rounded-pill fw-bold px-3 border border-dark"
                            style={{ fontSize: '0.78rem' }}
                          >
                            ✓ Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(sug.id)}
                            className="btn btn-sm btn-outline-secondary rounded-pill fw-bold px-3 border border-dark"
                            style={{ fontSize: '0.78rem' }}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopy(sug.improvedText, sug.id)}
                        className="btn btn-sm btn-light border border-dark rounded-pill fw-bold px-2 py-1"
                        style={{ fontSize: '0.75rem' }}
                        title="Copy improved text"
                      >
                        {copiedId === sug.id ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Original Text */}
                  <div
                    className="p-3 mb-2 rounded-3 border"
                    style={{
                      backgroundColor: '#FFF5F5',
                      borderColor: '#FECACA',
                      borderLeft: '4px solid #EF4444',
                      minWidth: 0
                    }}
                  >
                    <div className="small fw-bolder text-danger mb-1" style={{ fontSize: '0.75rem' }}>
                      ORIGINAL TEXT:
                    </div>
                    <p
                      className="mb-0 text-muted fst-italic small"
                      style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                    >
                      "{sug.originalText}"
                    </p>
                  </div>

                  {/* Improved Text */}
                  <div
                    className="p-3 mb-3 rounded-3 border"
                    style={{
                      backgroundColor: '#F0FDF4',
                      borderColor: '#BBF7D0',
                      borderLeft: '4px solid #16A34A',
                      minWidth: 0
                    }}
                  >
                    <div className="small fw-bolder text-success mb-1" style={{ fontSize: '0.75rem' }}>
                      SUGGESTED REVISION:
                    </div>
                    <p
                      className="mb-0 fw-bold text-dark small"
                      style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', lineHeight: 1.5 }}
                    >
                      "{sug.improvedText}"
                    </p>
                  </div>

                  {/* Why this suggestion is useful */}
                  <div
                    className="d-flex align-items-start gap-2 pt-2 border-top border-light text-muted small"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <span className="flex-shrink-0">💡</span>
                    <span style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                      <strong>Why this helps:</strong> {sug.explanation}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div
            className="p-3 rounded-4 border border-2 border-dark bg-white d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-center text-sm-start"
            style={{ boxShadow: '2px 2px 0px #1E293B', minWidth: 0 }}
          >
            <div className="small text-muted">
              {acceptedCount} of {suggestions.length} suggestions accepted into your updated resume draft.
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="nexus-btn-primary px-4 py-2 small"
            >
              📥 Download Updated Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
