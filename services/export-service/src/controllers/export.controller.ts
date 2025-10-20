import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs-extra';
import archiver from 'archiver';
import { generateStaticSite } from '../lib/generator';
import mongoose from 'mongoose';

// Import models
const ProjectSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  userId: String,
  theme: Object,
}, { timestamps: true });

const PageSchema = new mongoose.Schema({
  projectId: String,
  title: String,
  slug: String,
  content: String,
  blocks: Array,
  metadata: Object,
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);
const Page = mongoose.model('Page', PageSchema);

export const exportProject = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { projectId } = req.body;

    // Fetch project and pages
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const pages = await Page.find({ projectId }).sort({ 'metadata.sidebarPosition': 1 });

    // Generate static site
    const exportPath = await generateStaticSite(project, pages);

    res.json({
      success: true,
      message: 'Project exported successfully',
      data: {
        path: exportPath,
        downloadUrl: `/api/export/download/${projectId}`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting project',
      error: error.message,
    });
  }
};

export const downloadExport = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const exportDir = path.join(__dirname, '../../export', (project as any).slug);

    if (!fs.existsSync(exportDir)) {
      return res.status(404).json({
        success: false,
        message: 'Export not found. Please build the project first.',
      });
    }

    // Create zip archive
    res.attachment(`${(project as any).slug}.zip`);
    
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);
    archive.directory(exportDir, false);
    await archive.finalize();

  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading export',
      error: error.message,
    });
  }
};
