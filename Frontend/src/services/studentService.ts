import { api } from './api';
import { AuthUser } from '../types/AuthUser';
import { DEFAULT_MOCK_STUDENT } from '../context/AuthContext';

export interface SkillCatalogueItem {
  id: number;
  name: string;
  category: string;
}

export const studentService = {
  /**
   * Retrieves all students from Spring Boot backend.
   */
  async getStudents(): Promise<AuthUser[]> {
    try {
      const data = await api.get<AuthUser[]>('/students');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('[studentService] Failed to load students list from backend:', err);
      return [DEFAULT_MOCK_STUDENT];
    }
  },

  /**
   * Retrieves student by student ID.
   */
  async getStudentById(id: number): Promise<AuthUser | null> {
    try {
      return await api.get<AuthUser>(`/students/${id}`);
    } catch (err) {
      console.warn('[studentService] Failed to load student by ID:', err);
      return null;
    }
  },

  /**
   * Retrieves authenticated student profile by user ID.
   */
  async getStudentProfile(userId: number): Promise<AuthUser | null> {
    try {
      const resp = await api.get<{ status: string; student: AuthUser }>(`/students/profile/${userId}`);
      if (resp && resp.student) {
        return resp.student;
      }
      return null;
    } catch (err) {
      console.warn(`[studentService] Failed to load profile for user ID ${userId}:`, err);
      return null;
    }
  },

  /**
   * Updates student academic profile (CGPA, Branch, Grad Year, Skills) in MySQL.
   */
  async updateStudentProfile(
    userId: number,
    profileData: Partial<AuthUser>
  ): Promise<{ success: boolean; student?: AuthUser; message?: string }> {
    try {
      const resp = await api.put<{ status: string; message: string; student: AuthUser }>(
        `/students/profile/${userId}`,
        profileData
      );
      return {
        success: resp.status === 'SUCCESS',
        student: resp.student,
        message: resp.message
      };
    } catch (err: any) {
      console.warn('[studentService] Error updating academic profile:', err);
      return {
        success: false,
        message: err.message || 'Failed to update academic profile'
      };
    }
  },

  /**
   * Fetches curated skills catalogue.
   */
  async getSkillsCatalogue(): Promise<SkillCatalogueItem[]> {
    try {
      const resp = await api.get<{ status: string; skills: SkillCatalogueItem[] }>('/skills');
      return resp.skills || [];
    } catch (err) {
      console.warn('[studentService] Error loading skills catalogue:', err);
      return [];
    }
  }
};
