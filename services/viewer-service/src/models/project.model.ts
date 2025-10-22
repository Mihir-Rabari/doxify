import mongoose, { Schema, Document } from 'mongoose';

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
  theme: any;
  publishSettings: IPublishSettings;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    userId: { type: String, required: true },
    theme: { type: Schema.Types.Mixed },
    publishSettings: {
      isPublished: { type: Boolean, default: false },
      publishedAt: { type: Date },
      customDomain: { type: String },
      seoTitle: { type: String },
      seoDescription: { type: String },
      favicon: { type: String },
      analytics: {
        googleAnalyticsId: { type: String },
        plausibleDomain: { type: String },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
