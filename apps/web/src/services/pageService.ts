import api from './api';
import {
  Page,
  PageWithPreview,
  CreatePageData,
  UpdatePageData,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const pageService = {
  async getPages(projectId: string, page = 1, limit = 50): Promise<PaginatedResponse<Page>> {
    const response = await api.get(
      `/api/pages?projectId=${projectId}&page=${page}&limit=${limit}`
    );
    // Backend returns: { success, data: [...], pagination }
    // We need to return: { data: [...], pagination }
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  async getPage(id: string): Promise<Page> {
    const response = await api.get<ApiResponse<Page>>(`/api/pages/${id}`);
    return response.data.data!;
  },

  async getPagePreview(id: string): Promise<PageWithPreview> {
    const response = await api.get<ApiResponse<PageWithPreview>>(`/api/pages/${id}/preview`);
    return response.data.data!;
  },

  async createPage(data: CreatePageData): Promise<Page> {
    const response = await api.post<ApiResponse<Page>>('/api/pages', data);
    return response.data.data!;
  },

  async updatePage(id: string, data: UpdatePageData): Promise<Page> {
    const response = await api.put<ApiResponse<Page>>(`/api/pages/${id}`, data);
    return response.data.data!;
  },

  async deletePage(id: string): Promise<void> {
    await api.delete(`/api/pages/${id}`);
  },
};
