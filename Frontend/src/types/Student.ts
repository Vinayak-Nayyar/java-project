export interface Student {
  id: number;
  userId: number;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  cgpa: number;
  graduationYear: number;
  phone?: string;
  resumeUrl?: string;
}
