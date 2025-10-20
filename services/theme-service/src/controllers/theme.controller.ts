import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// We'll import the Project model to update theme
const ProjectSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  userId: String,
  theme: {
    primary: { type: String, default: '#3ECF8E' },
    secondary: { type: String, default: '#1F1F1F' },
    background: { type: String, default: '#FFFFFF' },
    foreground: { type: String, default: '#1F1F1F' },
    accent: { type: String, default: '#3ECF8E' },
    darkMode: { type: Boolean, default: false },
    font: { type: String, default: 'Inter' },
    codeTheme: { type: String, default: 'dracula' },
  },
  createdAt: Date,
  updatedAt: Date,
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

export const getTheme = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: (project as any).theme || {},
    });
  } catch (error: any) {
    console.error('Get theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching theme',
      error: error.message,
    });
  }
};

export const updateTheme = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { projectId } = req.params;
    const themeUpdates = req.body;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: { theme: themeUpdates } },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: (project as any).theme,
    });
  } catch (error: any) {
    console.error('Update theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating theme',
      error: error.message,
    });
  }
};
