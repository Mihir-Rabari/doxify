import { Request, Response } from 'express';
import Project from '../models/project.model';
import slugify from 'slugify';

// Publish a project
export const publishProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { seoTitle, seoDescription, customDomain, analytics } = req.body;

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update publish settings
    project.publishSettings = {
      isPublished: true,
      publishedAt: new Date(),
      seoTitle: seoTitle || project.name,
      seoDescription: seoDescription || project.description,
      customDomain: customDomain || undefined,
      analytics: analytics || undefined,
    };

    await project.save();

    res.json({
      success: true,
      message: 'Project published successfully',
      project: {
        _id: project._id,
        name: project.name,
        slug: project.slug,
        publishSettings: project.publishSettings,
        publicUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/sites/${project.slug}`
      }
    });
  } catch (error) {
    console.error('Publish project error:', error);
    res.status(500).json({ error: 'Failed to publish project' });
  }
};

// Unpublish a project
export const unpublishProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update publish settings
    project.publishSettings.isPublished = false;
    await project.save();

    res.json({
      success: true,
      message: 'Project unpublished successfully',
      project: {
        _id: project._id,
        name: project.name,
        slug: project.slug,
        publishSettings: project.publishSettings,
      }
    });
  } catch (error) {
    console.error('Unpublish project error:', error);
    res.status(500).json({ error: 'Failed to unpublish project' });
  }
};

// Update publish settings
export const updatePublishSettings = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update individual settings
    if (updates.seoTitle !== undefined) {
      project.publishSettings.seoTitle = updates.seoTitle;
    }
    if (updates.seoDescription !== undefined) {
      project.publishSettings.seoDescription = updates.seoDescription;
    }
    if (updates.customDomain !== undefined) {
      project.publishSettings.customDomain = updates.customDomain;
    }
    if (updates.favicon !== undefined) {
      project.publishSettings.favicon = updates.favicon;
    }
    if (updates.analytics !== undefined) {
      project.publishSettings.analytics = updates.analytics;
    }

    await project.save();

    res.json({
      success: true,
      message: 'Publish settings updated successfully',
      publishSettings: project.publishSettings
    });
  } catch (error) {
    console.error('Update publish settings error:', error);
    res.status(500).json({ error: 'Failed to update publish settings' });
  }
};

// Check slug availability
export const checkSlugAvailability = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { projectId } = req.query;

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.json({
        available: false,
        error: 'Slug can only contain lowercase letters, numbers, and hyphens'
      });
    }

    // Check if slug exists (excluding current project if updating)
    const query: any = { slug };
    if (projectId) {
      query._id = { $ne: projectId };
    }

    const existingProject = await Project.findOne(query);

    res.json({
      available: !existingProject,
      slug,
      message: existingProject ? 'Slug is already taken' : 'Slug is available'
    });
  } catch (error) {
    console.error('Check slug availability error:', error);
    res.status(500).json({ error: 'Failed to check slug availability' });
  }
};

// Generate slug from project name
export const generateSlug = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Generate base slug
    let baseSlug = slugify(name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    // Check if slug exists and add number if needed
    let slug = baseSlug;
    let counter = 1;
    
    while (await Project.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    res.json({
      success: true,
      slug,
      original: baseSlug
    });
  } catch (error) {
    console.error('Generate slug error:', error);
    res.status(500).json({ error: 'Failed to generate slug' });
  }
};
