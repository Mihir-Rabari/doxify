import api from './api';

export interface Section {
  _id: string;
  projectId: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionData {
  name: string;
  order?: number;
}

export interface UpdateSectionData {
  name?: string;
  order?: number;
}

export const sectionService = {
  // Get all sections for a project
  async getSections(projectId: string) {
    const response = await api.get(`/pages/projects/${projectId}/sections`);
    return response.data;
  },

  // Create a new section
  async createSection(projectId: string, data: CreateSectionData) {
    const response = await api.post(`/pages/projects/${projectId}/sections`, data);
    return response.data;
  },

  // Update a section
  async updateSection(sectionId: string, data: UpdateSectionData) {
    const response = await api.put(`/pages/sections/${sectionId}`, data);
    return response.data;
  },

  // Delete a section
  async deleteSection(sectionId: string) {
    const response = await api.delete(`/pages/sections/${sectionId}`);
    return response.data;
  },
};
