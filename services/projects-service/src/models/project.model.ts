import mongoose, { Schema, Document } from 'mongoose';

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

export interface IProject extends Document {
  name: string;
  slug: string;
  description?: string;
  userId: string;
  theme: ITheme;
  publishSettings: IPublishSettings;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSchema = new Schema({
  primary: { type: String, default: '#3ECF8E' },
  secondary: { type: String, default: '#1F1F1F' },
  background: { type: String, default: '#FFFFFF' },
  foreground: { type: String, default: '#1F1F1F' },
  accent: { type: String, default: '#3ECF8E' },
  darkMode: { type: Boolean, default: false },
  font: { type: String, default: 'Inter' },
  codeTheme: { type: String, default: 'dracula' },
});

const PublishSettingsSchema = new Schema({
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  customDomain: { type: String, trim: true },
  seoTitle: { type: String, trim: true },
  seoDescription: { type: String, trim: true },
  favicon: { type: String, trim: true },
  analytics: {
    googleAnalyticsId: { type: String, trim: true },
    plausibleDomain: { type: String, trim: true },
  },
});

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/, // Only lowercase alphanumeric and hyphens
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    theme: {
      type: ThemeSchema,
      default: () => ({}),
    },
    publishSettings: {
      type: PublishSettingsSchema,
      default: () => ({ isPublished: false }),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProjectSchema.index({ userId: 1, slug: 1 });
ProjectSchema.index({ 'publishSettings.isPublished': 1, slug: 1 }); // For published projects lookup

export default mongoose.model<IProject>('Project', ProjectSchema);
