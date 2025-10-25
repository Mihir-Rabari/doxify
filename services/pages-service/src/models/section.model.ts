// Firestore-compatible TypeScript interfaces for Section model

export interface ISection {
  id?: string;
  projectId: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
