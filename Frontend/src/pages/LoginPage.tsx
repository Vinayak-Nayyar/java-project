import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  // If already logged in, redirect
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
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please provide a valid email format (e.g., student@nexus.edu).';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await login(email);
      setFeedback('Validation successful! Logging you into your NEXUS account...');
      setTimeout(() => {
        if (email.toLowerCase().includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 600);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="nexus-card p-4 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex p-3 rounded-circle mb-3 border border-2 border-dark"
                style={{ backgroundColor: '#FEE054', boxShadow: '2px 2px 0px #1E293B' }}
              >
                <span className="fs-3">🔐</span>
              </div>
              <h2 className="fw-bolder" style={{ color: '#0F4A37' }}>Welcome Back</h2>
              <p className="text-muted small">
                Sign in to your NEXUS Placement and Job Portal account
              </p>
            </div>

            {feedback && (
              <div className="alert alert-success border-2 border-dark rounded-3 small text-center mb-4">
                ✓ {feedback}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
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
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label fw-bold small text-dark">Password</label>
                  <span className="small text-muted" style={{ cursor: 'pointer' }}>Forgot password?</span>
                </div>
                <input
                  type="password"
                  className={`form-control nexus-input ${errors.password ? 'is-invalid border-danger' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="nexus-btn-primary w-100 justify-content-center py-2 mb-3">
                Sign In to Nexus ↗
              </button>

              <div className="text-center small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="fw-bold text-success text-decoration-none">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
