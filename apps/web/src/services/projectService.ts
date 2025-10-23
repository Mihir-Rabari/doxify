import api from './api';
import {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const projectService = {
  async listProjects(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Project>> {
    const response = await api.get(
      `/api/projects?userId=${userId}&page=${page}&limit=${limit}`
    );
    
    // Backend returns: { success, data: [...], pagination }
    // We need to return: { data: [...], pagination }
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get<ApiResponse<Project>>(`/api/projects/${id}`);
    return response.data.data!;
  },

  async createProject(data: CreateProjectData & { userId: string }): Promise<Project> {
    const response = await api.post<ApiResponse<Project>>('/api/projects', data);
    return response.data.data!;
  },

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const response = await api.put<ApiResponse<Project>>(`/api/projects/${id}`, data);
    return response.data.data!;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/api/projects/${id}`);
  },
};
