// Firestore-compatible TypeScript interfaces for Page model

export interface IPageMetadata {
  sidebarPosition: number;
  tags: string[];
  description?: string;
  author?: string;
}

export interface IBlock {
  type: string;
  content: string;
  lang?: string;
  variant?: string;
  meta?: Record<string, any>;
}

export interface IPage {
  id?: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  blocks: IBlock[];
  section: string;
  order: number;
  metadata: IPageMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// Default values
export const defaultPageMetadata: IPageMetadata = {
  sidebarPosition: 0,
  tags: [],
};
