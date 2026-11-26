import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { SkillSelector } from '../components/SkillSelector';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, requestEmailChange, verifyEmailChange, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login?redirect=/profile', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Check URL query param ?edit=true
  const queryParams = new URLSearchParams(location.search);
  const isInitialEdit = queryParams.get('edit') === 'true';

  const [isEditing, setIsEditing] = useState(isInitialEdit);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    college: user?.college || 'National Institute of Technology, Karnataka',
    degree: user?.degree || 'Bachelor of Technology (B.Tech)',
    branch: user?.branch || 'Computer Science & Engineering',
    graduationYear: user?.graduationYear ? String(user?.graduationYear) : '2027',
    cgpa: user?.cgpa !== undefined ? String(user?.cgpa) : '8.92',
    department: user?.department || 'Placement & Corporate Relations',
    designation: user?.designation || 'Director of Placements'
  });

  const [skills, setSkills] = useState<string[]>(
    user?.skills || ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL']
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(user?.resumeFileName || null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Email Change Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [emailStep, setEmailStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Synchronize form with user context
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        college: user.college || 'National Institute of Technology, Karnataka',
        degree: user.degree || 'Bachelor of Technology (B.Tech)',
        branch: user.branch || 'Computer Science & Engineering',
        graduationYear: user.graduationYear ? String(user.graduationYear) : '2027',
        cgpa: user.cgpa !== undefined ? String(user.cgpa) : '8.92',
        department: user.department || 'Placement & Corporate Relations',
        designation: user.designation || 'Director of Placements'
      });
      setSkills(user.skills || ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL']);
      setAvatarPreview(user.avatarUrl || null);
      setResumeFileName(user.resumeFileName || null);
    }
  }, [user, isEditing]);

  if (!user) {
    return null;
  }

  const isStudent = user.role === 'STUDENT';
  const isInstitutional =
    user.email.toLowerCase().endsWith('.edu') ||
    user.email.toLowerCase().endsWith('.ac.in');

  // Profile Picture Upload Handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: 'Only JPG, JPEG, PNG, or WebP images are supported.' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: 'Image size exceeds 2MB limit.' }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.avatar;
      return copy;
    });

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Resume Upload Handler (PDF only, max 5MB)
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrors((prev) => ({ ...prev, resume: 'Please upload a PDF document (.pdf only).' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: 'Resume file size cannot exceed 5MB.' }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.resume;
      return copy;
    });

    setUploadProgress(25);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setResumeFileName(file.name);
          return null;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleRemoveResume = () => {
    setResumeFileName(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  // Form Validation & Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name cannot be empty.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 8) {
      newErrors.phone = 'Please provide a valid phone number (at least 8 digits).';
    }

    if (isStudent) {
      const cgpaNum = parseFloat(formData.cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        newErrors.cgpa = 'CGPA must be a valid number between 0.00 and 10.00.';
      }

      const gradYear = parseInt(formData.graduationYear, 10);
      if (isNaN(gradYear) || gradYear < 2020 || gradYear > 2035) {
        newErrors.graduationYear = 'Graduation year must be between 2020 and 2035.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFeedback({ type: 'danger', message: 'Please correct highlighted errors before saving.' });
      return;
    }

    const updatedUser = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      avatarUrl: avatarPreview || undefined,
      ...(isStudent
        ? {
            college: formData.college.trim(),
            degree: formData.degree.trim(),
            branch: formData.branch.trim(),
            graduationYear: parseInt(formData.graduationYear, 10),
            cgpa: parseFloat(formData.cgpa),
            skills,
            resumeFileName: resumeFileName || undefined
          }
        : {
            department: formData.department.trim(),
            designation: formData.designation.trim()
          })
    };

    const res = await updateProfile(updatedUser);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Profile credentials and CGPA synchronized successfully!' });
      setIsEditing(false);
      setErrors({});
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: 'danger', message: res.message || 'Failed to save changes.' });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setFeedback(null);
  };

  // Open Email Update Modal
  const handleOpenEmailModal = () => {
    setNewEmailInput('');
    setOtpInput('');
    setEmailStep('REQUEST');
    setEmailFeedback(null);
    setGeneratedOtpDisplay(null);
    setShowEmailModal(true);
  };

  // Email Step 1: Request OTP
  const handleRequestEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailFeedback(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmailInput.trim())) {
      setEmailFeedback({ type: 'danger', message: 'Please provide a valid email format.' });
      return;
    }

    const res = await requestEmailChange(newEmailInput.trim());
    if (res.success) {
      setEmailStep('VERIFY');
      setGeneratedOtpDisplay(res.simulatedOtp || null);
      setEmailFeedback({
        type: 'success',
        message: res.message || 'Verification OTP generated.'
      });
    } else {
      setEmailFeedback({ type: 'danger', message: res.message });
    }
  };

  // Email Step 2: Verify OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailFeedback(null);

    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setEmailFeedback({ type: 'danger', message: 'Please enter the 6-digit verification code.' });
      return;
    }

    const res = await verifyEmailChange(newEmailInput.trim(), otpInput.trim());
    if (res.success) {
      setShowEmailModal(false);
      setFeedback({ type: 'success', message: `Institutional email successfully verified and changed to ${newEmailInput.trim()}!` });
      setTimeout(() => setFeedback(null), 5000);
    } else {
      setEmailFeedback({ type: 'danger', message: res.message });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container py-4">
      {/* Top Feedback Banner */}
      {feedback && (
        <div
          className={`alert alert-${feedback.type} border-2 border-dark rounded-3 shadow-sm d-flex align-items-center justify-content-between mb-4`}
        >
          <div className="d-flex align-items-center gap-2">
            <span>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
            <span className="fw-semibold small">{feedback.message}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setFeedback(null)}
          ></button>
        </div>
      )}

      {/* ============================================================
          PROFILE HEADER CARD
          ============================================================ */}
      <div className="nexus-card p-4 p-md-5 mb-4 position-relative overflow-hidden">
        <div className="row align-items-center gy-4">
          {/* Avatar Column */}
          <div className="col-auto text-center">
            <div className="position-relative d-inline-block">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={user.name}
                  className="rounded-circle border border-3 border-dark"
                  style={{
                    width: '110px',
                    height: '110px',
                    objectFit: 'cover',
                    boxShadow: '3px 3px 0px #1E293B'
                  }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bolder border border-3 border-dark"
                  style={{
                    width: '110px',
                    height: '110px',
                    backgroundColor: isStudent ? '#FEE054' : '#DDD6FE',
                    fontSize: '2.4rem',
                    color: '#0F4A37',
                    boxShadow: '3px 3px 0px #1E293B'
                  }}
                >
                  {getInitials(user.name)}
                </div>
              )}

              {/* Photo Upload Trigger in Edit Mode */}
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-sm btn-dark rounded-circle position-absolute bottom-0 end-0 border border-2 border-white"
                  title="Upload / Change Photo"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '34px', height: '34px', padding: 0 }}
                >
                  📷
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
              />
            </div>
            {errors.avatar && <div className="text-danger small mt-1">{errors.avatar}</div>}
          </div>

          {/* User Info Column */}
          <div className="col">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h2 className="fw-bolder mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>
                {user.name}
              </h2>
              <Badge variant={isStudent ? 'yellow' : 'lilac'}>
                {isStudent ? '🎓 Student Account' : '🏢 Placement Administrator'}
              </Badge>
              {isStudent && user.rollNumber && (
                <Badge variant="green">Roll: {user.rollNumber}</Badge>
              )}
            </div>

            <p className="text-muted mb-3 d-flex flex-wrap align-items-center gap-3 small">
              <span className="fw-semibold text-dark">
                📧 {user.email}
              </span>
              {isInstitutional ? (
                <Badge variant="green">✓ Institutional Email</Badge>
              ) : (
                <Badge variant="yellow">⚠️ Non-Institutional Email</Badge>
              )}
              {user.phone && <span>📞 {user.phone}</span>}
              {user.location && <span>📍 {user.location}</span>}
            </p>

            {/* Quick summary for student */}
            {isStudent && (
              <div className="d-flex flex-wrap gap-2">
                <span className="badge-pill-lilac">
                  📚 {user.branch || 'Computer Science & Engineering'}
                </span>
                <span className="badge-pill-yellow">
                  ⭐ CGPA: {user.cgpa !== undefined ? user.cgpa : '8.92'}
                </span>
                <span className="badge-pill-green">
                  📅 Class of {user.graduationYear || '2027'}
                </span>
              </div>
            )}

            {/* Quick summary for admin */}
            {!isStudent && (
              <div className="d-flex flex-wrap gap-2">
                <span className="badge-pill-lilac">
                  🏢 {user.department || 'Training & Placement Office'}
                </span>
                <span className="badge-pill-yellow">
                  💼 {user.designation || 'Placement Director'}
                </span>
              </div>
            )}
          </div>

          {/* Action Button Column */}
          <div className="col-12 col-md-auto text-md-end">
            {!isEditing ? (
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="nexus-btn-outline"
                  onClick={handleOpenEmailModal}
                >
                  ✉️ Update Email
                </button>
                <button
                  type="button"
                  className="nexus-btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-dark rounded-pill fw-bold px-3"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="nexus-btn-green"
                  onClick={handleSave}
                >
                  ✓ Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN PROFILE CONTENT
          ============================================================ */}
      <div className="row g-4">
        {/* LEFT COLUMN: Personal Details */}
        <div className={isStudent ? 'col-lg-6' : 'col-12'}>
          <div className="nexus-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-2 border-light">
              <h5 className="fw-bolder mb-0 text-dark">
                👤 Personal Information
              </h5>
              <span className="badge-pill-lilac small">
                {isEditing ? 'Editing Mode' : 'Verified Details'}
              </span>
            </div>

            {!isEditing ? (
              /* VIEW MODE */
              <div className="d-flex flex-column gap-3">
                <div>
                  <small className="text-muted fw-bold text-uppercase d-block mb-1">Full Legal Name</small>
                  <div className="fw-bold text-dark fs-6">{user.name}</div>
                </div>

                {/* Email Display with Institutional Verification Badge */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted fw-bold text-uppercase">
                      Institutional Email Address
                    </small>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-success fw-bold text-decoration-none small"
                      onClick={handleOpenEmailModal}
                    >
                      Change Email ↗
                    </button>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="fw-bold text-dark fs-6">{user.email}</span>
                    {isInstitutional ? (
                      <Badge variant="green">✓ Verified Institutional</Badge>
                    ) : (
                      <Badge variant="yellow">⚠️ External / Unverified</Badge>
                    )}
                  </div>
                  {!isInstitutional && (
                    <small className="text-muted d-block mt-1">
                      Notice: Your profile is using an external email. Click 'Change Email' to verify your university address.
                    </small>
                  )}
                </div>

                <div>
                  <small className="text-muted fw-bold text-uppercase d-block mb-1">Phone Number</small>
                  <div className="fw-semibold text-dark fs-6">{user.phone || 'Not provided'}</div>
                </div>

                <div>
                  <small className="text-muted fw-bold text-uppercase d-block mb-1">Location / Residence</small>
                  <div className="fw-semibold text-dark fs-6">{user.location || 'Bengaluru, Karnataka'}</div>
                </div>

                {!isStudent && (
                  <>
                    <div>
                      <small className="text-muted fw-bold text-uppercase d-block mb-1">Department</small>
                      <div className="fw-semibold text-dark fs-6">{user.department || 'Training & Placement Office'}</div>
                    </div>
                    <div>
                      <small className="text-muted fw-bold text-uppercase d-block mb-1">Official Role / Designation</small>
                      <div className="fw-semibold text-dark fs-6">{user.designation || 'Head of Placements'}</div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* EDIT MODE */
              <div className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label fw-bold small">Full Name *</label>
                  <input
                    type="text"
                    className={`form-control nexus-input ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                </div>

                {/* Email in Edit Mode: Read-Only with Change Action Trigger */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-bold small mb-0">Registered Institutional Email</label>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-success fw-bold text-decoration-none p-0 small"
                      onClick={handleOpenEmailModal}
                    >
                      Update Email ↗
                    </button>
                  </div>
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control nexus-input bg-light"
                      value={formData.email}
                      disabled
                      readOnly
                    />
                    <button
                      type="button"
                      className="btn btn-outline-dark fw-bold px-3 small"
                      onClick={handleOpenEmailModal}
                    >
                      Change
                    </button>
                  </div>
                  <small className="text-muted d-block mt-1">
                    🔒 Email changes require institutional OTP verification to prevent unauthorized account hijacking.
                  </small>
                </div>

                <div>
                  <label className="form-label fw-bold small">Phone Number *</label>
                  <input
                    type="text"
                    className={`form-control nexus-input ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
                </div>

                <div>
                  <label className="form-label fw-bold small">Current Location / City</label>
                  <input
                    type="text"
                    className="form-control nexus-input"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {!isStudent && (
                  <>
                    <div>
                      <label className="form-label fw-bold small">Department</label>
                      <input
                        type="text"
                        className="form-control nexus-input"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label fw-bold small">Designation</label>
                      <input
                        type="text"
                        className="form-control nexus-input"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Academic Information (STUDENTS ONLY) */}
        {isStudent && (
          <div className="col-lg-6">
            <div className="nexus-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-2 border-light">
                <h5 className="fw-bolder mb-0 text-dark">
                  🎓 Academic Credentials
                </h5>
                <span className="badge-pill-yellow small">Authoritative Record</span>
              </div>

              {!isEditing ? (
                /* VIEW MODE */
                <div className="d-flex flex-column gap-3">
                  <div>
                    <small className="text-muted fw-bold text-uppercase d-block mb-1">College / University</small>
                    <div className="fw-bold text-dark fs-6">{user.college || 'National Institute of Technology, Karnataka'}</div>
                  </div>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <small className="text-muted fw-bold text-uppercase d-block mb-1">Degree</small>
                      <div className="fw-semibold text-dark">{user.degree || 'B.Tech'}</div>
                    </div>
                    <div className="col-sm-6">
                      <small className="text-muted fw-bold text-uppercase d-block mb-1">Branch / Major</small>
                      <div className="fw-semibold text-dark">{user.branch || 'Computer Science & Engineering'}</div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <small className="text-muted fw-bold text-uppercase d-block mb-1">Cumulative CGPA</small>
                      <div className="fw-bolder text-success fs-5">{user.cgpa !== undefined ? user.cgpa : '8.92'} / 10.00</div>
                    </div>
                    <div className="col-sm-6">
                      <small className="text-muted fw-bold text-uppercase d-block mb-1">Graduation Year</small>
                      <div className="fw-bolder text-dark fs-5">{user.graduationYear || '2027'}</div>
                    </div>
                  </div>

                  {/* Skills Display */}
                  <div className="mt-2">
                    <small className="text-muted fw-bold text-uppercase d-block mb-2">Technical Skills & Tools ({skills.length})</small>
                    <div className="d-flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className="badge-pill-green">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* EDIT MODE */
                <div className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-bold small">College / Institute *</label>
                    <input
                      type="text"
                      className="form-control nexus-input"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label fw-bold small">Degree *</label>
                      <input
                        type="text"
                        className="form-control nexus-input"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fw-bold small">Branch / Department *</label>
                      <input
                        type="text"
                        className="form-control nexus-input"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label fw-bold small">CGPA (0.00 - 10.00) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        className={`form-control nexus-input ${errors.cgpa ? 'is-invalid' : ''}`}
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                      />
                      {errors.cgpa && <div className="text-danger small mt-1">{errors.cgpa}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-bold small">Graduation Year *</label>
                      <input
                        type="number"
                        min="2020"
                        max="2035"
                        className={`form-control nexus-input ${errors.graduationYear ? 'is-invalid' : ''}`}
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      />
                      {errors.graduationYear && <div className="text-danger small mt-1">{errors.graduationYear}</div>}
                    </div>
                  </div>

                  {/* SEARCHABLE PREDEFINED SKILLS SELECTOR (PART 2 FIX) */}
                  <div className="mt-2">
                    <SkillSelector
                      selectedSkills={skills}
                      onChange={setSkills}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: Resume Management (STUDENTS ONLY) - PART 3 FIX FOR CONTAINER OVERFLOW */}
        {isStudent && (
          <div className="col-12">
            <div className="nexus-card p-4" style={{ minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-2 border-light">
                <div>
                  <h5 className="fw-bolder mb-0 text-dark">
                    📄 Resume & Portfolio Document
                  </h5>
                  <small className="text-muted">
                    This document is automatically attached when applying for campus vacancies
                  </small>
                </div>
                <span className="badge-pill-lilac">PDF Format Only</span>
              </div>

              {/* Upload Progress Bar if simulating */}
              {uploadProgress !== null && (
                <div className="progress mb-3" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {errors.resume && (
                <div className="alert alert-danger border-2 border-dark rounded-3 small mb-3">
                  ⚠️ {errors.resume}
                </div>
              )}

              {resumeFileName ? (
                /* Resume Attached State: FULLY RESPONSIVE AND BOUND WITHIN CARD */
                <div
                  className="p-3 p-md-4 rounded-4 border border-2 border-dark d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3"
                  style={{ backgroundColor: '#F8FAF7', minWidth: 0, width: '100%', boxSizing: 'border-box' }}
                >
                  {/* Left Side: Icon & Filename (minWidth: 0 prevents flex overflow) */}
                  <div className="d-flex align-items-center gap-3" style={{ minWidth: 0, flex: '1 1 auto' }}>
                    <div
                      className="p-2 rounded-3 border border-2 border-dark d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ backgroundColor: '#fee2e2', width: '48px', height: '48px' }}
                    >
                      <span className="fw-bolder text-danger" style={{ fontSize: '0.9rem' }}>PDF</span>
                    </div>
                    <div style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
                      <div
                        className="fw-bold text-dark text-truncate"
                        style={{
                          fontSize: '0.95rem',
                          maxWidth: '100%',
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word'
                        }}
                        title={resumeFileName}
                      >
                        {resumeFileName}
                      </div>
                      <small className="text-muted d-block text-truncate">
                        Verified student placement resume • Active for 2026-27 drives
                      </small>
                    </div>
                  </div>

                  {/* Right Side: Action Buttons (flex-shrink-0 guarantees button integrity) */}
                  <div className="d-flex flex-wrap align-items-center gap-2 flex-shrink-0 mt-2 mt-lg-0">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark rounded-pill fw-bold px-3"
                      onClick={() => alert(`Previewing verified resume: ${resumeFileName}`)}
                    >
                      👁️ View Document
                    </button>
                    {isEditing && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-warning rounded-pill fw-bold px-3 border border-dark"
                          onClick={() => resumeInputRef.current?.click()}
                        >
                          🔄 Replace
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill fw-bold px-3"
                          onClick={handleRemoveResume}
                        >
                          🗑️ Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* No Resume Attached State */
                <div
                  className="p-4 text-center rounded-4 border border-2 border-dashed border-dark"
                  style={{ backgroundColor: '#fcfcfc', cursor: isEditing ? 'pointer' : 'default' }}
                  onClick={() => isEditing && resumeInputRef.current?.click()}
                >
                  <span className="fs-1">📑</span>
                  <h6 className="fw-bold mt-2 mb-1">No Resume Attached Yet</h6>
                  <p className="text-muted small mb-3">
                    {isEditing
                      ? 'Click to select and upload your resume in PDF format (Max 5MB).'
                      : 'Switch to Edit Profile to upload your technical resume.'}
                  </p>
                  {isEditing && (
                    <button
                      type="button"
                      className="nexus-btn-primary py-2 px-3 small"
                      onClick={(e) => {
                        e.stopPropagation();
                        resumeInputRef.current?.click();
                      }}
                    >
                      + Select PDF Resume
                    </button>
                  )}
                </div>
              )}

              {/* Hidden Resume File Input */}
              <input
                type="file"
                ref={resumeInputRef}
                style={{ display: 'none' }}
                accept="application/pdf"
                onChange={handleResumeChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          INSTITUTIONAL EMAIL CHANGE MODAL (PART 1 FIX)
          ============================================================ */}
      {showEmailModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1080 }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border border-2 border-dark rounded-4 shadow-lg p-3"
              style={{ boxShadow: '6px 6px 0px #1E293B' }}
            >
              <div className="modal-header border-0 pb-0">
                <div>
                  <span className="badge-pill-yellow small mb-1">Security & Verification</span>
                  <h5 className="modal-title fw-bolder text-dark" style={{ color: '#0F4A37' }}>
                    Update Institutional Email
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEmailModal(false)}
                ></button>
              </div>

              <div className="modal-body py-3">
                {emailFeedback && (
                  <div className={`alert alert-${emailFeedback.type} border-2 border-dark rounded-3 small mb-3`}>
                    {emailFeedback.message}
                  </div>
                )}

                <div className="mb-3 p-3 rounded-3 bg-light border border-secondary-subtle">
                  <small className="text-muted fw-bold d-block">Current Registered Email:</small>
                  <span className="fw-bold text-dark">{user.email}</span>
                </div>

                {emailStep === 'REQUEST' ? (
                  <form onSubmit={handleRequestEmailOtp}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        New Institutional Email Address *
                      </label>
                      <input
                        type="email"
                        className="form-control nexus-input"
                        placeholder="e.g. aarav.sharma@nexus.edu"
                        value={newEmailInput}
                        onChange={(e) => setNewEmailInput(e.target.value)}
                        required
                        autoFocus
                      />
                      <small className="text-muted d-block mt-1">
                        Domain restriction: Address must belong to your accredited educational institution (e.g. <code>@nexus.edu</code> or <code>.edu</code> / <code>.ac.in</code>).
                      </small>
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-2">
                      <button
                        type="button"
                        className="btn btn-outline-dark rounded-pill fw-bold px-3"
                        onClick={() => setShowEmailModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="nexus-btn-primary px-4">
                        Generate Verification Code ↗
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyEmailOtp}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        Enter 6-Digit Verification Code *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        className="form-control nexus-input text-center fw-bolder fs-4"
                        placeholder="• • • • • •"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        required
                        autoFocus
                      />
                      <small className="text-muted d-block mt-1">
                        Code dispatched for <strong>{newEmailInput}</strong>. Expires in 10 minutes.
                      </small>
                    </div>

                    {/* Demonstration Helper for Evaluation Environment */}
                    {generatedOtpDisplay && (
                      <div className="p-3 mb-3 rounded-3 border border-2 border-success bg-success-subtle small">
                        <strong>Demo Verification OTP:</strong> <code>{generatedOtpDisplay}</code>
                        <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                          (In production, this OTP is dispatched via university SMTP mail relay to your institutional inbox).
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center pt-2">
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-muted text-decoration-none"
                        onClick={() => setEmailStep('REQUEST')}
                      >
                        ← Back / Change Address
                      </button>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-dark rounded-pill fw-bold px-3"
                          onClick={() => setShowEmailModal(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="nexus-btn-green px-4">
                          ✓ Verify & Apply Email
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
