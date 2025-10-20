// User Types
export interface IUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project Types
export interface IProject {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  userId: string;
  theme: ITheme;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  slug?: string;
}

// Theme Types
export interface ITheme {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: string;
  darkMode: boolean;
  font: string;
  codeTheme: string;
}

export interface UpdateThemeDto {
  primary?: string;
  secondary?: string;
  background?: string;
  foreground?: string;
  accent?: string;
  darkMode?: boolean;
  font?: string;
  codeTheme?: string;
}

// Page Types
export interface IPage {
  _id: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  blocks: IBlock[];
  metadata: IPageMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPageMetadata {
  sidebarPosition: number;
  tags: string[];
  description?: string;
  author?: string;
}

export interface CreatePageDto {
  projectId: string;
  title: string;
  content?: string;
  metadata?: Partial<IPageMetadata>;
}

export interface UpdatePageDto {
  title?: string;
  content?: string;
  slug?: string;
  metadata?: Partial<IPageMetadata>;
}

// Block Types
export interface IBlock {
  type: BlockType;
  content: string;
  lang?: string;
  variant?: string;
  meta?: Record<string, any>;
}

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'code'
  | 'note'
  | 'warning'
  | 'info'
  | 'danger'
  | 'list'
  | 'blockquote'
  | 'image'
  | 'link'
  | 'table';

// Parser Types
export interface ParsedContent {
  metadata: Record<string, any>;
  blocks: IBlock[];
  raw: string;
}

export interface ParseRequest {
  content: string;
  format?: 'mdx' | 'markdown';
}

// Export Types
export interface ExportRequest {
  projectId: string;
  format: 'nextjs' | 'static';
}

export interface ExportResponse {
  success: boolean;
  path: string;
  message: string;
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: IUserResponse;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
