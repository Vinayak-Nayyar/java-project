import { api, ApiError } from './api';
import { Job } from '../types/Job';
import { MOCK_JOBS } from './mockData';

export interface JobFilterParams {
  [key: string]: string | number | boolean | undefined | null;
  search?: string;
  branch?: string;
  category?: string;
}

export const jobService = {
  /**
   * Retrieves all jobs from Spring Boot MySQL backend, applying search and branch filters.
   * Gracefully falls back to mock data if backend connection fails.
   */
  async getJobs(filters?: JobFilterParams): Promise<Job[]> {
    try {
      const data = await api.get<Job[]>('/jobs', { params: filters });
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (err) {
      console.warn('[jobService] Backend unavailable, filtering cached mock jobs:', err);
      // Fallback local filtering
      let jobs = [...MOCK_JOBS];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        jobs = jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.companyName.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q)
        );
      }
      if (filters?.branch && filters.branch !== 'ALL') {
        jobs = jobs.filter(
          (j) =>
            j.eligibleBranch.includes(filters.branch!) ||
            j.eligibleBranch === 'All Branches'
        );
      }
      if (filters?.category) {
        const cat = filters.category.toLowerCase();
        if (cat === 'remote') jobs = jobs.filter((j) => j.location.toLowerCase() === 'remote');
        if (cat === 'internship') jobs = jobs.filter((j) => j.jobType === 'Internship');
        if (cat === 'highpackage') jobs = jobs.filter((j) => j.salaryPackage >= 14);
      }
      return jobs;
    }
  },

  /**
   * Retrieves single job details by ID.
   */
  async getJobById(id: number): Promise<Job> {
    try {
      return await api.get<Job>(`/jobs/${id}`);
    } catch (err) {
      const match = MOCK_JOBS.find((j) => j.id === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * Retrieves jobs posted by a specific company.
   */
  async getJobsByCompany(companyId: number): Promise<Job[]> {
    try {
      return await api.get<Job[]>(`/companies/${companyId}/jobs`);
    } catch (err) {
      return MOCK_JOBS.filter((j) => j.companyId === companyId);
    }
  },

  /**
   * Creates a new job opportunity.
   */
  async createJob(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    return await api.post<Job>('/jobs', job);
  },

  /**
   * Updates an existing job posting.
   */
  async updateJob(id: number, job: Partial<Job>): Promise<Job> {
    return await api.put<Job>(`/jobs/${id}`, job);
  },

  /**
   * Deletes a job posting by ID.
   */
  async deleteJob(id: number): Promise<boolean> {
    try {
      await api.delete<{ status: string; message: string }>(`/jobs/${id}`);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return false;
      }
      throw err;
    }
  }
};
