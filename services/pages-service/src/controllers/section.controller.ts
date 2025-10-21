import { Request, Response } from 'express';
import Section from '../models/section.model';
import Page from '../models/page.model';

// Get all sections for a project
export const getSections = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const sections = await Section.find({ projectId }).sort({ order: 1 });

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

    // Check if section already exists
    const existingSection = await Section.findOne({ projectId, name });
    if (existingSection) {
      return res.status(400).json({
        success: false,
        message: 'Section with this name already exists',
      });
    }

    const section = new Section({
      projectId,
      name,
      order: order || 0,
    });

    await section.save();

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

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // If renaming, update all pages in this section
    if (name && name !== section.name) {
      await Page.updateMany(
        { projectId: section.projectId, section: section.name },
        { section: name }
      );
    }

    if (name) section.name = name;
    if (order !== undefined) section.order = order;

    await section.save();

    res.json({
      success: true,
      data: section,
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

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Move all pages in this section to "General"
    await Page.updateMany(
      { projectId: section.projectId, section: section.name },
      { section: 'General' }
    );

    await Section.findByIdAndDelete(sectionId);

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
