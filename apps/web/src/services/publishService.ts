import api from './api';

export interface PublishSettings {
  isPublished: boolean;
  publishedAt?: Date;
  customDomain?: string;
  seoTitle?: string;
  seoDescription?: string;
  favicon?: string;
  analytics?: {
    googleAnalyticsId?: string;
    plausibleDomain?: string;
  };
}

export interface PublishResponse {
  success: boolean;
  message: string;
  project: {
    _id: string;
    name: string;
    slug: string;
    publishSettings: PublishSettings;
    publicUrl: string;
  };
}

export const publishService = {
  // Publish a project
  async publishProject(projectId: string, settings?: Partial<PublishSettings>) {
    const response = await api.post<PublishResponse>(`/api/projects/${projectId}/publish`, settings);
    return response.data;
  },

  // Unpublish a project
  async unpublishProject(projectId: string) {
    const response = await api.post<PublishResponse>(`/api/projects/${projectId}/unpublish`);
    return response.data;
  },

  // Update publish settings
  async updatePublishSettings(projectId: string, settings: Partial<PublishSettings>) {
    const response = await api.patch(`/api/projects/${projectId}/publish-settings`, settings);
    return response.data;
  },

  // Check slug availability
  async checkSlugAvailability(slug: string, projectId?: string) {
    const params = projectId ? `?projectId=${projectId}` : '';
    const response = await api.get<{ available: boolean; slug: string; message: string }>(
      `/api/projects/slugs/${slug}/availability${params}`
    );
    return response.data;
  },

  // Generate slug from name
  async generateSlug(name: string) {
    const response = await api.post<{ success: boolean; slug: string; original: string }>(
      '/api/projects/slugs/generate',
      { name }
    );
    return response.data;
  },
};
