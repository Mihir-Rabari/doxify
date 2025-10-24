
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
  theme: ITheme;
  publishSettings: IPublishSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Default values
export const defaultTheme: ITheme = {
  primary: '#3ECF8E',
  secondary: '#1F1F1F',
  background: '#FFFFFF',
  foreground: '#1F1F1F',
  accent: '#3ECF8E',
  darkMode: false,
  font: 'Inter',
  codeTheme: 'dracula',
};

export const defaultPublishSettings: IPublishSettings = {
  isPublished: false,
};
