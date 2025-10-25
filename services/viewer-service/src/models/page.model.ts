// Firestore-compatible TypeScript interface for Page model

export interface IPage {
  id?: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  section: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
