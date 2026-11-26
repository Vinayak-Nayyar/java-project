import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please provide a valid email format.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await register({ name: fullName, email, role });
      setFeedback('Registration successful! Welcome to NEXUS Placement Portal.');
      setTimeout(() => {
        if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 700);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="nexus-card p-4 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex p-3 rounded-circle mb-3 border border-2 border-dark"
                style={{ backgroundColor: '#DDD6FE', boxShadow: '2px 2px 0px #1E293B' }}
              >
                <span className="fs-3">🎓</span>
              </div>
              <h2 className="fw-bolder" style={{ color: '#0F4A37' }}>Create Your Account</h2>
              <p className="text-muted small">
                Join NEXUS to discover campus placements and corporate opportunities
              </p>
            </div>

            {feedback && (
              <div className="alert alert-success border-2 border-dark rounded-3 small text-center mb-4">
                ✓ {feedback}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Role Selection */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-dark">Select Account Role</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`flex-fill py-2 rounded-pill fw-bold border border-2 border-dark ${
                      role === 'STUDENT' ? 'bg-warning text-dark shadow-sm' : 'bg-light text-muted'
                    }`}
                    onClick={() => setRole('STUDENT')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`flex-fill py-2 rounded-pill fw-bold border border-2 border-dark ${
                      role === 'ADMIN' ? 'bg-warning text-dark shadow-sm' : 'bg-light text-muted'
                    }`}
                    onClick={() => setRole('ADMIN')}
                  >
                    Placement Admin
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-dark">Full Name</label>
                <input
                  type="text"
                  className={`form-control nexus-input ${errors.fullName ? 'is-invalid border-danger' : ''}`}
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-dark">Email Address</label>
                <input
                  type="email"
                  className={`form-control nexus-input ${errors.email ? 'is-invalid border-danger' : ''}`}
                  placeholder="e.g. aarav.sharma@nexus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-dark">Password</label>
                <input
                  type="password"
                  className={`form-control nexus-input ${errors.password ? 'is-invalid border-danger' : ''}`}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label fw-bold small text-dark">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control nexus-input ${errors.confirmPassword ? 'is-invalid border-danger' : ''}`}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                  <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="nexus-btn-primary w-100 justify-content-center py-2 mb-3">
                Complete Registration ↗
              </button>

              <div className="text-center small text-muted">
                Already registered?{' '}
                <Link to="/login" className="fw-bold text-success text-decoration-none">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
