import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import slugify from 'slugify';
import Project from '../models/project.model';

export const createProject = async (req: Request, res: Response) => {
  console.log('🟣 [PROJECTS] POST /api/projects request received');
  console.log('🟣 [PROJECTS] Request body:', JSON.stringify(req.body));
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ [PROJECTS] Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, userId } = req.body;

    // Generate slug
    let slug = slugify(name, { lower: true, strict: true });
    
    // Check if slug exists and make it unique
    let existingProject = await Project.findOne({ slug, userId });
    let counter = 1;
    while (existingProject) {
      slug = `${slugify(name, { lower: true, strict: true })}-${counter}`;
      existingProject = await Project.findOne({ slug, userId });
      counter++;
    }

    const project = await Project.create({
      name,
      slug,
      description,
      userId,
    });

    console.log('✅ [PROJECTS] Project created:', project._id);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    console.error('❌ [PROJECTS] Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  console.log('🟣 [PROJECTS] GET /api/projects request received');
  console.log('🟣 [PROJECTS] Query params:', req.query);
  
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (userId) {
      query.userId = userId;
    }

    console.log('🟣 [PROJECTS] Query filter:', query);

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(query);
    console.log('🟣 [PROJECTS] Total projects found:', total);
    
    const projects = await Project.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    console.log('🟣 [PROJECTS] Returning', projects.length, 'projects');

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('❌ [PROJECTS] Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // If name is being updated, regenerate slug
    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
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
      data: project,
    });
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message,
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: project,
    });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    });
  }
};
