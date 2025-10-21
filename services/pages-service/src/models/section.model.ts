import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  projectId: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema: Schema = new Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique section name per project
SectionSchema.index({ projectId: 1, name: 1 }, { unique: true });

export default mongoose.model<ISection>('Section', SectionSchema);
