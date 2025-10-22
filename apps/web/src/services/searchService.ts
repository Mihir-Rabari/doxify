import api from './api';

export interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  section: string;
  score: number;
  matchedIn: 'title' | 'content';
  preview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
}

export interface SearchSuggestion {
  _id: string;
  title: string;
  slug: string;
  section: string;
}

export const searchService = {
  // Main search function
  async searchPages(projectId: string, query: string, options?: { limit?: number; section?: string }) {
    const params = new URLSearchParams({
      q: query,
      ...(options?.limit && { limit: options.limit.toString() }),
      ...(options?.section && { section: options.section })
    });

    const response = await api.get<SearchResponse>(`/api/pages/projects/${projectId}/search?${params}`);
    return response.data;
  },

  // Get search suggestions for autocomplete
  async getSearchSuggestions(projectId: string, query: string, limit: number = 5) {
    const response = await api.get<{ suggestions: SearchSuggestion[] }>(
      `/api/pages/projects/${projectId}/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data.suggestions;
  },

  // Get recent pages
  async getRecentPages(projectId: string, limit: number = 10) {
    const response = await api.get<{ pages: SearchResult[] }>(
      `/api/pages/projects/${projectId}/search/recent?limit=${limit}`
    );
    return response.data.pages;
  }
};
