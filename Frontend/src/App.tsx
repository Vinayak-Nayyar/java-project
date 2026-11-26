import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { BrowseJobsPage } from './pages/BrowseJobsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageCompaniesPage } from './pages/ManageCompaniesPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Default redirect to Browse Jobs */}
          <Route path="/" element={<Navigate to="/student/jobs" replace />} />

          {/* Public Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public / Student Vacancy Browsing */}
          <Route path="/student/jobs" element={<BrowseJobsPage />} />

          {/* Protected Student Portal */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Profile Page (All authenticated users) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Portal */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageCompaniesPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/student/jobs" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
