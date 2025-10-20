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

export interface IProject extends Document {
  name: string;
  slug: string;
  description?: string;
  userId: string;
  theme: ITheme;
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
  },
  {
    timestamps: true,
  }
);

// Indexes
ProjectSchema.index({ userId: 1, slug: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
