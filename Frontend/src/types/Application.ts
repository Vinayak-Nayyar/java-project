export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface Application {
  id: number;
  studentId: number;
  studentName?: string;
  jobId: number;
  jobTitle: string;
  companyName: string;
  salaryPackage: number; // in LPA
  appliedDate: string;
  status: ApplicationStatus;
  remarks?: string;
}
