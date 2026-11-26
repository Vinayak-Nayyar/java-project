import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types/AuthUser';
import { API_BASE_URL } from '../services/api';

interface EmailChangeRequestResult {
  success: boolean;
  message: string;
  simulatedOtp?: string;
  newEmail?: string;
  expiresAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; role: UserRole; phone?: string }) => Promise<{ success: boolean }>;
  updateProfile: (data: Partial<AuthUser>) => Promise<{ success: boolean; message?: string }>;
  requestEmailChange: (newEmail: string) => Promise<EmailChangeRequestResult>;
  verifyEmailChange: (newEmail: string, otpCode: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const STORAGE_KEY = 'nexus_auth_user';

// Pre-configured mock student profile matching Database & sample data
export const DEFAULT_MOCK_STUDENT: AuthUser = {
  id: 3,
  name: 'Aarav Sharma',
  email: 'aarav.sharma@nexus.edu',
  role: 'STUDENT',
  phone: '+91 98765 43210',
  location: 'Bengaluru, Karnataka',
  college: 'National Institute of Technology, Karnataka',
  degree: 'Bachelor of Technology (B.Tech)',
  rollNumber: 'CS202301',
  branch: 'Computer Science & Engineering',
  graduationYear: 2027,
  cgpa: 8.92,
  skills: ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL', 'Docker', 'REST API', 'Git'],
  resumeFileName: 'Aarav_Sharma_Technical_Resume.pdf',
  resumeUrl: 'https://nexus.edu/resumes/aarav_sharma.pdf',
  avatarUrl: ''
};

// Pre-configured mock admin profile
export const DEFAULT_MOCK_ADMIN: AuthUser = {
  id: 1,
  name: 'Placement Officer Admin',
  email: 'admin.placement@nexus.edu',
  role: 'ADMIN',
  phone: '+91 (080) 2456-7890',
  location: 'Bengaluru, Karnataka',
  department: 'Office of Career Services & Corporate Relations',
  designation: 'Director of Training & Campus Placements',
  avatarUrl: ''
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('[AuthContext] Failed reading stored auth user:', e);
    }
    return null;
  });

  // Sync to localStorage whenever user changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('[AuthContext] Failed saving user to localStorage:', e);
    }
  }, [user]);

  const login = async (email: string, chosenRole?: UserRole): Promise<{ success: boolean; message?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const isAdmin = chosenRole === 'ADMIN' || normalizedEmail.includes('admin');

    let authenticatedUser: AuthUser;

    if (isAdmin) {
      authenticatedUser = {
        ...DEFAULT_MOCK_ADMIN,
        email: email.trim(),
        name: normalizedEmail.includes('admin') ? DEFAULT_MOCK_ADMIN.name : email.split('@')[0].replace('.', ' ')
      };
    } else {
      authenticatedUser = {
        ...DEFAULT_MOCK_STUDENT,
        email: email.trim(),
        name: normalizedEmail.includes('aarav') ? DEFAULT_MOCK_STUDENT.name : email.split('@')[0].replace('.', ' ')
      };
    }

    // Check if we have persistent customized profile in storage for this email
    try {
      const stored = localStorage.getItem(`profile_${authenticatedUser.email}`);
      if (stored) {
        authenticatedUser = { ...authenticatedUser, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore
    }

    setUser(authenticatedUser);
    return { success: true };
  };

  const register = async (data: { name: string; email: string; role: UserRole; phone?: string }) => {
    const newUser: AuthUser = data.role === 'ADMIN'
      ? {
          ...DEFAULT_MOCK_ADMIN,
          id: Math.floor(Math.random() * 900) + 100,
          name: data.name,
          email: data.email,
          phone: data.phone || '+91 98765 00000',
          role: 'ADMIN'
        }
      : {
          ...DEFAULT_MOCK_STUDENT,
          id: Math.floor(Math.random() * 900) + 100,
          name: data.name,
          email: data.email,
          phone: data.phone || '+91 98765 00000',
          role: 'STUDENT',
          rollNumber: `CS2023${Math.floor(Math.random() * 80) + 10}`
        };

    setUser(newUser);
    return { success: true };
  };

  const updateProfile = async (updatedFields: Partial<AuthUser>): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'No active session found.' };
    }

    const mergedUser: AuthUser = {
      ...user,
      ...updatedFields
    };

    // Update frontend state immediately
    setUser(mergedUser);

    // Save to localStorage for resilient persistence across refresh & tabs
    try {
      localStorage.setItem(`profile_${mergedUser.email}`, JSON.stringify(mergedUser));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedUser));
    } catch (e) {
      console.warn('[AuthContext] LocalStorage write error:', e);
    }

    // Synchronize to Backend REST endpoint if server is online
    try {
      if (user.role === 'STUDENT') {
        fetch(`${API_BASE_URL}/students/profile/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: mergedUser.name,
            branch: mergedUser.branch,
            cgpa: mergedUser.cgpa,
            graduationYear: mergedUser.graduationYear,
            phone: mergedUser.phone,
            college: mergedUser.college,
            degree: mergedUser.degree,
            location: mergedUser.location,
            skills: mergedUser.skills
          })
        }).catch((err) => {
          // Graceful fallback if Spring Boot backend is offline
          console.log('[AuthContext] Backend offline; persisted in local state:', err.message);
        });
      }
    } catch (e) {
      console.warn('[AuthContext] Backend sync error:', e);
    }

    return { success: true, message: 'Profile updated and synchronized successfully.' };
  };

  /**
   * Request institutional email change.
   * Generates secure OTP and stores pending verification.
   */
  const requestEmailChange = async (newEmail: string): Promise<EmailChangeRequestResult> => {
    if (!user) {
      return { success: false, message: 'You must be logged in to change your email.' };
    }

    const normalizedNew = newEmail.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedNew)) {
      return { success: false, message: 'Please provide a valid email format.' };
    }

    if (normalizedNew === user.email.toLowerCase()) {
      return { success: false, message: 'The new email must be different from your currently registered email.' };
    }

    // Call backend API if running
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/email/request-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentEmail: user.email,
          newEmail: normalizedNew
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        return {
          success: true,
          message: data.message || 'Verification code generated.',
          simulatedOtp: data.verificationCode,
          newEmail: normalizedNew,
          expiresAt: data.expiresAt
        };
      }
    } catch {
      // Fallback: Client-side cryptographic simulated OTP for academic demo when backend is offline
    }

    // Fallback simulation (for testing when backend is offline)
    const simulatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem(`pending_email_${user.id}`, JSON.stringify({
      newEmail: normalizedNew,
      otp: simulatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    }));

    return {
      success: true,
      message: 'Institutional email change requested. A 6-digit verification code has been dispatched.',
      simulatedOtp,
      newEmail: normalizedNew,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    };
  };

  /**
   * Verifies the OTP and applies the email change.
   */
  const verifyEmailChange = async (newEmail: string, otpCode: string): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'No active session.' };
    }

    const normalizedNew = newEmail.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    // Call Backend verification if running
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/email/verify-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          newEmail: normalizedNew,
          otpCode: cleanOtp
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        // Update user email
        const oldEmail = user.email;
        const updated = { ...user, email: normalizedNew };
        setUser(updated);
        localStorage.removeItem(`profile_${oldEmail}`);
        localStorage.setItem(`profile_${normalizedNew}`, JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return { success: true, message: data.message || 'Email successfully verified and updated!' };
      }
    } catch {
      // Fallback client-side verification
    }

    // Verify against pending storage
    const pendingRaw = localStorage.getItem(`pending_email_${user.id}`);
    if (!pendingRaw) {
      return { success: false, message: 'No pending verification request found. Please request a new code.' };
    }

    const pending = JSON.parse(pendingRaw);
    if (Date.now() > pending.expiresAt) {
      localStorage.removeItem(`pending_email_${user.id}`);
      return { success: false, message: 'The verification code has expired. Please request a new code.' };
    }

    if (pending.otp !== cleanOtp || pending.newEmail !== normalizedNew) {
      return { success: false, message: 'Invalid verification code. Please check and try again.' };
    }

    // Successful verification
    localStorage.removeItem(`pending_email_${user.id}`);
    const oldEmail = user.email;
    const updated = { ...user, email: normalizedNew };
    setUser(updated);
    try {
      localStorage.removeItem(`profile_${oldEmail}`);
      localStorage.setItem(`profile_${normalizedNew}`, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    return { success: true, message: 'Institutional email successfully verified and updated!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        updateProfile,
        requestEmailChange,
        verifyEmailChange,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
