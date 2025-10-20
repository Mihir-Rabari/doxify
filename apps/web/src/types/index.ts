// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Project Types
export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: string;
  darkMode: boolean;
  font: string;
  codeTheme: string;
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  userId: string;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

// Page Types
export interface PageMetadata {
  sidebarPosition: number;
  tags: string[];
  description?: string;
  author?: string;
}

export interface Block {
  type: string;
  content: string;
  lang?: string;
  variant?: string;
  meta?: Record<string, unknown>;
}

export interface Page {
  _id: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  blocks: Block[];
  metadata: PageMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface PageWithPreview extends Page {
  html?: string;
}

export interface CreatePageData {
  projectId: string;
  title: string;
  content?: string;
  metadata?: Partial<PageMetadata>;
}

export interface UpdatePageData {
  title?: string;
  content?: string;
  slug?: string;
  metadata?: Partial<PageMetadata>;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Export Types
export interface ExportResponse {
  success: boolean;
  message: string;
  data: {
    path: string;
    downloadUrl: string;
  };
}
