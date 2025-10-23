import axios, { AxiosInstance } from 'axios';

class APIService {
  private authService: AxiosInstance;
  private projectsService: AxiosInstance;
  private pagesService: AxiosInstance;
  private viewerService: AxiosInstance;
  private exportService: AxiosInstance;

  constructor() {
    const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
    const PROJECTS_URL = process.env.PROJECTS_SERVICE_URL || 'http://localhost:4002';
    const PAGES_URL = process.env.PAGES_SERVICE_URL || 'http://localhost:4003';
    const VIEWER_URL = process.env.VIEWER_SERVICE_URL || 'http://localhost:4007';
    const EXPORT_URL = process.env.EXPORT_SERVICE_URL || 'http://localhost:4006';

    this.authService = axios.create({ baseURL: AUTH_URL });
    this.projectsService = axios.create({ baseURL: PROJECTS_URL });
    this.pagesService = axios.create({ baseURL: PAGES_URL });
    this.viewerService = axios.create({ baseURL: VIEWER_URL });
    this.exportService = axios.create({ baseURL: EXPORT_URL });
  }

  // Project Operations
  async createProject(data: any) {
    const response = await this.projectsService.post('/api/projects', data);
    return response.data;
  }

  async listProjects(userId: string) {
    const response = await this.projectsService.get(`/api/projects/user/${userId}`);
    return response.data;
  }

  async getProject(projectId: string) {
    const response = await this.projectsService.get(`/api/projects/${projectId}`);
    return response.data;
  }

  async updateProject(projectId: string, data: any) {
    const response = await this.projectsService.put(`/api/projects/${projectId}`, data);
    return response.data;
  }

  async deleteProject(projectId: string) {
    const response = await this.projectsService.delete(`/api/projects/${projectId}`);
    return response.data;
  }

  // Page Operations
  async createPage(data: any) {
    const response = await this.pagesService.post('/api/pages', data);
    return response.data;
  }

  async listPages(projectId: string) {
    const response = await this.pagesService.get(`/api/pages/projects/${projectId}`);
    return response.data;
  }

  async getPage(pageId: string) {
    const response = await this.pagesService.get(`/api/pages/${pageId}`);
    return response.data;
  }

  async updatePage(pageId: string, data: any) {
    const response = await this.pagesService.put(`/api/pages/${pageId}`, data);
    return response.data;
  }

  async deletePage(pageId: string) {
    const response = await this.pagesService.delete(`/api/pages/${pageId}`);
    return response.data;
  }

  // Section Operations
  async createSection(data: any) {
    const response = await this.pagesService.post('/api/sections', data);
    return response.data;
  }

  async listSections(projectId: string) {
    const response = await this.pagesService.get(`/api/sections/projects/${projectId}`);
    return response.data;
  }

  // Search Operations
  async searchPages(projectId: string, query: string, limit: number = 10) {
    const response = await this.pagesService.get(
      `/api/pages/projects/${projectId}/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data;
  }

  // Publishing Operations
  async publishProject(projectId: string, settings: any) {
    const response = await this.projectsService.post(`/api/projects/${projectId}/publish`, settings);
    return response.data;
  }

  async unpublishProject(projectId: string) {
    const response = await this.projectsService.post(`/api/projects/${projectId}/unpublish`);
    return response.data;
  }

  // Export Operations
  async exportProject(projectId: string, format: string) {
    const response = await this.exportService.post(`/api/export/${projectId}`, { format });
    return response.data;
  }

  // Navigation Operations
  async getNavigation(projectId: string) {
    const response = await this.pagesService.get(`/api/pages/projects/${projectId}/navigation`);
    return response.data;
  }
}

export default new APIService();
