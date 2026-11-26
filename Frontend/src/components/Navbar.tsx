import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from './Badge';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
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
    <nav className="navbar navbar-expand-lg nexus-navbar sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/student/jobs" className="navbar-brand d-flex align-items-center gap-2">
          <div
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#0F4A37',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FEE054',
              fontWeight: 800,
              fontSize: '1.2rem',
              border: '2px solid #1E293B',
              boxShadow: '2px 2px 0px #1E293B'
            }}
          >
            N
          </div>
          <span className="brand-text">NEXUS</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nexusNav"
          aria-controls="nexusNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="nexusNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <Link
                to="/student/jobs"
                className={`nav-link fw-semibold px-2 ${isActive('/student/jobs') ? 'text-success fw-bold' : 'text-dark'}`}
              >
                Browse Jobs
              </Link>
            </li>

            {/* Links for Students or Logged-out users */}
            {(!isAuthenticated || user?.role === 'STUDENT') && (
              <li className="nav-item">
                <Link
                  to="/student/dashboard"
                  className={`nav-link fw-semibold px-2 ${isActive('/student/dashboard') ? 'text-success fw-bold' : 'text-dark'}`}
                >
                  Student Portal
                </Link>
              </li>
            )}

            {/* Links for Admins or Logged-out users */}
            {(!isAuthenticated || user?.role === 'ADMIN') && (
              <>
                <li className="nav-item">
                  <Link
                    to="/admin/dashboard"
                    className={`nav-link fw-semibold px-2 ${isActive('/admin/dashboard') ? 'text-success fw-bold' : 'text-dark'}`}
                  >
                    Admin Overview
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/admin/companies"
                    className={`nav-link fw-semibold px-2 ${isActive('/admin/companies') ? 'text-success fw-bold' : 'text-dark'}`}
                  >
                    Manage Companies
                  </Link>
                </li>
              </>
            )}

            {/* My Profile direct nav tab when logged in */}
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  to="/profile"
                  className={`nav-link fw-semibold px-2 ${isActive('/profile') ? 'text-success fw-bold' : 'text-dark'}`}
                >
                  My Profile
                </Link>
              </li>
            )}
          </ul>

          {/* Right Action Area */}
          <div className="d-flex align-items-center gap-2">
            {!isAuthenticated ? (
              /* LOGGED OUT STATE: Show Sign In and Sign Up */
              <>
                <Link to="/register" className="nexus-btn-outline text-decoration-none">
                  Sign Up
                </Link>
                <Link to="/login" className="nexus-btn-lilac text-decoration-none">
                  Sign In
                </Link>
              </>
            ) : (
              /* LOGGED IN STATE: Show User Indicator & Profile Dropdown */
              <div className="position-relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="btn p-1 d-flex align-items-center gap-2 border border-2 border-dark rounded-pill bg-white shadow-sm"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                >
                  {/* User Avatar */}
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="rounded-circle border border-dark"
                      style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark border border-dark"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: user?.role === 'ADMIN' ? '#DDD6FE' : '#FEE054',
                        fontSize: '0.85rem'
                      }}
                    >
                      {user ? getInitials(user.name) : 'U'}
                    </div>
                  )}

                  {/* Account Name Indicator */}
                  <div className="text-start d-none d-sm-block pe-2">
                    <div className="fw-bold text-dark small lh-1">{user?.name}</div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {user?.role === 'ADMIN' ? 'Placement Admin' : 'Student'}
                    </small>
                  </div>

                  <span className="small text-muted pe-1">▼</span>
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="position-absolute end-0 mt-2 py-2 bg-white rounded-4 border border-2 border-dark shadow-lg"
                    style={{
                      width: '240px',
                      zIndex: 1050,
                      boxShadow: '4px 4px 0px #1E293B'
                    }}
                  >
                    {/* Header with Role */}
                    <div className="px-3 py-2 border-bottom border-2 border-light mb-1">
                      <div className="fw-bold text-dark">{user?.name}</div>
                      <div className="text-muted small text-truncate mb-2">{user?.email}</div>
                      <Badge variant={user?.role === 'ADMIN' ? 'lilac' : 'yellow'}>
                        {user?.role === 'ADMIN' ? 'Admin Access' : 'Verified Student'}
                      </Badge>
                    </div>

                    {/* Role-Specific Navigation Options */}
                    {user?.role === 'STUDENT' ? (
                      <>
                        <Link
                          to="/profile"
                          className="dropdown-item px-3 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>👤</span> My Profile
                        </Link>
                        <Link
                          to="/student/dashboard"
                          className="dropdown-item px-3 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>📋</span> My Applications
                        </Link>
                        <Link
                          to="/profile?edit=true"
                          className="dropdown-item px-3 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>✏️</span> Edit Profile
                        </Link>
                        <Link
                          to="/profile"
                          className="dropdown-item px-3 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>⚙️</span> Settings
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="dropdown-item px-3 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>👤</span> My Profile
                        </Link>
                        <Link
                          to="/admin/dashboard"
                          className="dropdown-item px-3 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>📊</span> Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/companies"
                          className="dropdown-item px-3 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>🏢</span> Manage Companies
                        </Link>
                        <Link
                          to="/profile"
                          className="dropdown-item px-3 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>⚙️</span> Settings
                        </Link>
                      </>
                    )}

                    <div className="border-top border-2 border-light my-1"></div>

                    {/* Logout Option */}
                    <button
                      type="button"
                      className="dropdown-item px-3 py-2 fw-bold text-danger d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start"
                      onClick={handleLogout}
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
