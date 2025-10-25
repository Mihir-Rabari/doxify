import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import slugify from 'slugify';
import axios from 'axios';
import { IPage } from '../models/page.model';
import { getPageRepository } from '../repositories/page.repository';

const PARSER_SERVICE_URL = process.env.PARSER_SERVICE_URL || 'http://localhost:4004';

export const createPage = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { projectId, title, content = '', section = 'General', order = 0, metadata = {} } = req.body;

    // Generate slug
    let slug = '/' + slugify(title, { lower: true, strict: true });
    
    // Check if slug exists in project and make it unique
    const pageRepo = getPageRepository();
    let existingPage = await pageRepo.findByProjectIdAndSlug(projectId, slug);
    let counter = 1;
    while (existingPage) {
      slug = `/${slugify(title, { lower: true, strict: true })}-${counter}`;
      existingPage = await pageRepo.findByProjectIdAndSlug(projectId, slug);
      counter++;
    }

    // Parse content if provided
    let blocks = [];
    if (content) {
      try {
        const parseResponse = await axios.post(`${PARSER_SERVICE_URL}/api/parser/parse`, {
          content,
          format: 'mdx',
        });
        blocks = parseResponse.data.data.blocks || [];
      } catch (parseError) {
        console.error('Parser error:', parseError);
      }
    }

    const page = await pageRepo.create({
      projectId,
      title,
      slug,
      content,
      blocks,
      section,
      order,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: page,
    });
  } catch (error: any) {
    console.error('Create page error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating page',
      error: error.message,
    });
  }
};

export const getPages = async (req: Request, res: Response) => {
  try {
    const { projectId, page = 1, limit = 50 } = req.query;

    const pageRepo = getPageRepository();
    const pages = await pageRepo.findByProjectId(projectId as string);

    const total = pages.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedPages = pages.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      data: paginatedPages,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pages',
      error: error.message,
    });
  }
};

export const getPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pageRepo = getPageRepository();
    const page = await pageRepo.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (error: any) {
    console.error('Get page error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching page',
      error: error.message,
    });
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // If title is being updated, regenerate slug
    if (updates.title) {
      const pageRepo = getPageRepository();
      const page = await pageRepo.findById(id);
      if (page) {
        updates.slug = '/' + slugify(updates.title, { lower: true, strict: true });
      }
    }

    // If content is being updated, reparse it
    if (updates.content) {
      try {
        const parseResponse = await axios.post(`${PARSER_SERVICE_URL}/api/parser/parse`, {
          content: updates.content,
          format: 'mdx',
        });
        updates.blocks = parseResponse.data.data.blocks || [];
      } catch (parseError) {
        console.error('Parser error:', parseError);
      }
    }

    const pageRepo = getPageRepository();
    const page = await pageRepo.update(id, updates);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (error: any) {
    console.error('Update page error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating page',
      error: error.message,
    });
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pageRepo = getPageRepository();
    await pageRepo.delete(id);

    res.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete page error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting page',
      error: error.message,
    });
  }
};

export const getPagePreview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pageRepo = getPageRepository();
    const page = await pageRepo.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    // Render content to HTML
    let html = '';
    if (page.content) {
      try {
        const renderResponse = await axios.post(`${PARSER_SERVICE_URL}/api/parser/render`, {
          content: page.content,
          format: 'mdx',
        });
        html = renderResponse.data.data.html || '';
      } catch (renderError) {
        console.error('Render error:', renderError);
      }
    }

    res.json({
      success: true,
      data: {
        ...page,
        html,
      },
    });
  } catch (error: any) {
    console.error('Get page preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching page preview',
      error: error.message,
    });
  }
};
