import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import slugify from 'slugify';
import { IProject, defaultTheme, defaultPublishSettings } from '../models/project.model';

// Stub implementation - TODO: Implement with Firestore
export const createProject = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, userId } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    
    const project: IProject = {
      id: Date.now().toString(),
      name,
      slug,
      description,
      userId,
      theme: defaultTheme,
      publishSettings: defaultPublishSettings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    res.status(201).json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true, projects: [] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(404).json({ success: false, message: 'Project not found' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    res.status(404).json({ success: false, message: 'Project not found' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    res.status(404).json({ success: false, message: 'Project not found' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
