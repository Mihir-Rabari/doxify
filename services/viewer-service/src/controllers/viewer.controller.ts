import { Request, Response } from 'express';
import Project from '../models/project.model';
import Page from '../models/page.model';

// Get published project by slug
export const getPublishedProject = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ 
      slug,
      'publishSettings.isPublished': true 
    }).select('-userId'); // Don't expose userId to public

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found or not published',
        slug 
      });
    }

    res.json({
      success: true,
      project: {
        _id: project._id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        theme: project.theme,
        publishSettings: {
          seoTitle: project.publishSettings.seoTitle,
          seoDescription: project.publishSettings.seoDescription,
          favicon: project.publishSettings.favicon,
          analytics: project.publishSettings.analytics,
        },
        publishedAt: project.publishSettings.publishedAt,
      }
    });
  } catch (error) {
    console.error('Get published project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Get all pages for a published project
export const getPublishedPages = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // First verify project is published
    const project = await Project.findOne({ 
      slug,
      'publishSettings.isPublished': true 
    });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found or not published' 
      });
    }

    // Get all pages for this project
    const pages = await Page.find({ projectId: project._id.toString() })
      .sort({ section: 1, order: 1 })
      .select('title slug content section order')
      .lean();

    // Group pages by section
    const sections = pages.reduce((acc: any, page) => {
      const section = page.section || 'General';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(page);
      return acc;
    }, {});

    res.json({
      success: true,
      projectSlug: slug,
      pages,
      sections,
      totalPages: pages.length
    });
  } catch (error) {
    console.error('Get published pages error:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

// Get a single page from a published project
export const getPublishedPage = async (req: Request, res: Response) => {
  try {
    const { slug, pageSlug } = req.params;

    // First verify project is published
    const project = await Project.findOne({ 
      slug,
      'publishSettings.isPublished': true 
    });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found or not published' 
      });
    }

    // Get the specific page (handle both with and without leading slash)
    const page = await Page.findOne({ 
      projectId: project._id.toString(),
      $or: [
        { slug: pageSlug },
        { slug: `/${pageSlug}` },
        { slug: pageSlug.startsWith('/') ? pageSlug.slice(1) : `/${pageSlug}` }
      ]
    }).select('title slug content section order').lean();

    if (!page) {
      return res.status(404).json({ 
        error: 'Page not found',
        pageSlug 
      });
    }

    res.json({
      success: true,
      projectSlug: slug,
      page
    });
  } catch (error) {
    console.error('Get published page error:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

// Get navigation structure for a published project
export const getPublishedNavigation = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Verify project is published
    const project = await Project.findOne({ 
      slug,
      'publishSettings.isPublished': true 
    });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found or not published' 
      });
    }

    // Get pages with minimal data for navigation
    const pages = await Page.find({ projectId: project._id.toString() })
      .sort({ section: 1, order: 1 })
      .select('title slug section order')
      .lean();

    // Group by section
    const sections = pages.reduce((acc: any, page) => {
      const section = page.section || 'General';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push({
        title: page.title,
        slug: page.slug,
        order: page.order
      });
      return acc;
    }, {});

    res.json({
      success: true,
      projectSlug: slug,
      navigation: sections
    });
  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).json({ error: 'Failed to fetch navigation' });
  }
};
