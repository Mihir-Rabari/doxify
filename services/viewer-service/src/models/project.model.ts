// Firestore-compatible TypeScript interfaces for Project model

export interface IPublishSettings {
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

export interface IProject {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  userId: string;
  theme: any;
  publishSettings: IPublishSettings;
  createdAt: Date;
  updatedAt: Date;
}
