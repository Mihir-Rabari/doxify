import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  projectId: string;
  title: string;
  slug: string;
  content: string;
  section: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema: Schema = new Schema(
  {
    projectId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, default: '' },
    section: { type: String, default: 'General' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PageSchema.index({ projectId: 1, slug: 1 }, { unique: true });

export default mongoose.model<IPage>('Page', PageSchema);
