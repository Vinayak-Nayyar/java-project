import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/AuthUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to login preserving destination
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User does not have authorization for this route
    return (
      <div className="container py-5 text-center">
        <div className="nexus-card p-5 mx-auto" style={{ maxWidth: '580px' }}>
          <span className="fs-1">🚫</span>
          <h2 className="fw-bolder mt-3 text-danger">Access Restricted</h2>
          <p className="text-muted small">
            Your current account role (<strong>{user.role}</strong>) does not have authorization to view this placement administrative console.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link
              to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
              className="nexus-btn-primary"
            >
              Return to My Portal ↗
            </Link>
            <Link to="/profile" className="nexus-btn-outline">
              My Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
