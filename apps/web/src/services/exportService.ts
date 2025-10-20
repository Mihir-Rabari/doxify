import api from './api';
import { ExportResponse } from '@/types';

export const exportService = {
  async buildProject(projectId: string): Promise<ExportResponse> {
    const response = await api.post<ExportResponse>('/api/export/build', { projectId });
    return response.data;
  },

  getDownloadUrl(projectId: string): string {
    return `${api.defaults.baseURL}/api/export/download/${projectId}`;
  },
};
