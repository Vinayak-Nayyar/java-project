export interface Job {
  id: number;
  companyId: number;
  companyName: string;
  title: string;
  description: string;
  jobType: 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
  salaryPackage: number; // in LPA
  eligibleBranch: string;
  minCgpa: number;
  location: string;
  deadline: string;
  createdAt?: string;
}
