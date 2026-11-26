import { api, ApiError } from './api';
import { Company } from '../types/Company';
import { MOCK_COMPANIES } from './mockData';

export const companyService = {
  /**
   * Retrieves all registered companies from Spring Boot MySQL backend.
   * If backend is offline, falls back gracefully to default initial dataset.
   */
  async getCompanies(): Promise<Company[]> {
    try {
      const data = await api.get<Company[] | { status: string; companies: Company[] }>('/companies');
      if (Array.isArray(data)) {
        return data;
      }
      if (data && 'companies' in data && Array.isArray(data.companies)) {
        return data.companies;
      }
      return [];
    } catch (err) {
      console.warn('[companyService] Backend unavailable, utilizing cached mock company list:', err);
      return MOCK_COMPANIES;
    }
  },

  /**
   * Retrieves a single company by ID.
   */
  async getCompanyById(id: number): Promise<Company> {
    try {
      return await api.get<Company>(`/companies/${id}`);
    } catch (err) {
      const match = MOCK_COMPANIES.find((c) => c.id === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * Adds a new recruiting company to MySQL database.
   */
  async createCompany(company: Omit<Company, 'id' | 'createdAt'>): Promise<Company> {
    return await api.post<Company>('/companies', company);
  },

  /**
   * Updates existing company information in MySQL database.
   */
  async updateCompany(id: number, company: Partial<Company>): Promise<Company> {
    return await api.put<Company>(`/companies/${id}`, company);
  },

  /**
   * Deletes a company by ID from MySQL database.
   */
  async deleteCompany(id: number): Promise<boolean> {
    try {
      await api.delete<{ status: string; message: string }>(`/companies/${id}`);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return false;
      }
      throw err;
    }
  }
};
