import mongoose, { Schema, Document } from 'mongoose';

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

export interface IPage extends Document {
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

const PageMetadataSchema = new Schema({
  sidebarPosition: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  description: { type: String },
  author: { type: String },
});

const BlockSchema = new Schema({
  type: { type: String, required: true },
  content: { type: String, required: true },
  lang: { type: String },
  variant: { type: String },
  meta: { type: Schema.Types.Mixed },
});

const PageSchema: Schema = new Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    blocks: {
      type: [BlockSchema],
      default: [],
    },
    section: {
      type: String,
      default: 'General',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: PageMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique slug per project
PageSchema.index({ projectId: 1, slug: 1 }, { unique: true });

export default mongoose.model<IPage>('Page', PageSchema);
