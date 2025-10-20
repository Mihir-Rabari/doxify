import api from './api';
import { Theme, ApiResponse } from '@/types';

export const themeService = {
  async getTheme(projectId: string): Promise<Theme> {
    const response = await api.get<ApiResponse<Theme>>(`/api/theme/${projectId}`);
    return response.data.data!;
  },

  async updateTheme(projectId: string, data: Partial<Theme>): Promise<Theme> {
    const response = await api.put<ApiResponse<Theme>>(`/api/theme/${projectId}`, data);
    return response.data.data!;
  },
};
