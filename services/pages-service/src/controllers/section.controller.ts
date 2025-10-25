import { Request, Response } from 'express';
import { ISection } from '../models/section.model';
import { IPage } from '../models/page.model';
import { getPageRepository } from '../repositories/page.repository';
import { getSectionRepository } from '../repositories/section.repository';

// Get all sections for a project
export const getSections = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const sectionRepo = getSectionRepository();
    const sections = await sectionRepo.findByProjectId(projectId);

    res.json({
      success: true,
      data: sections,
    });
  } catch (error: any) {
    console.error('Get sections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sections',
      error: error.message,
    });
  }
};

// Create a new section
export const createSection = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, order } = req.body;

    const sectionRepo = getSectionRepository();
    
    // Check if section already exists
    const existingSection = await sectionRepo.findByProjectIdAndName(projectId, name);
    if (existingSection) {
      return res.status(400).json({
        success: false,
        message: 'Section with this name already exists',
      });
    }

    const section = await sectionRepo.create({
      projectId,
      name,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      data: section,
    });
  } catch (error: any) {
    console.error('Create section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create section',
      error: error.message,
    });
  }
};

// Update a section
export const updateSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { name, order } = req.body;

    const sectionRepo = getSectionRepository();
    const section = await sectionRepo.findById(sectionId);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // If renaming, update all pages in this section
    if (name && name !== section.name) {
      const pageRepo = getPageRepository();
      const pages = await pageRepo.findByProjectIdAndSection(section.projectId, section.name);
      
      // Update each page's section
      for (const page of pages) {
        if (page.id) {
          await pageRepo.update(page.id, { section: name });
        }
      }
    }

    const updates: Partial<ISection> = {};
    if (name) updates.name = name;
    if (order !== undefined) updates.order = order;

    const updatedSection = await sectionRepo.update(sectionId, updates);

    res.json({
      success: true,
      data: updatedSection,
    });
  } catch (error: any) {
    console.error('Update section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section',
      error: error.message,
    });
  }
};

// Delete a section
export const deleteSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    const sectionRepo = getSectionRepository();
    const section = await sectionRepo.findById(sectionId);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Move all pages in this section to "General"
    const pageRepo = getPageRepository();
    const pages = await pageRepo.findByProjectIdAndSection(section.projectId, section.name);
    
    for (const page of pages) {
      if (page.id) {
        await pageRepo.update(page.id, { section: 'General' });
      }
    }

    await sectionRepo.delete(sectionId);

    res.json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete section',
      error: error.message,
    });
  }
};
