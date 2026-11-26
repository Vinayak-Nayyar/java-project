export type UserRole = 'STUDENT' | 'ADMIN';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  location?: string;

  // Student specific academic & resume data
  college?: string;
  degree?: string;
  rollNumber?: string;
  branch?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string[];
  resumeFileName?: string;
  resumeUrl?: string;

  // Admin specific data
  department?: string;
  designation?: string;
}
