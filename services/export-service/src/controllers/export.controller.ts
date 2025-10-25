import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs-extra';
import archiver from 'archiver';
import { generateStaticSite } from '../lib/generator';
import { Firestore } from '@google-cloud/firestore';

const db = new Firestore();
const projectsCollection = db.collection('projects');
const pagesCollection = db.collection('pages');

export const exportProject = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { projectId } = req.body;

    // Fetch project and pages
    const projectDoc = await projectsCollection.doc(projectId).get();
    if (!projectDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const project = { id: projectDoc.id, ...projectDoc.data() };

    const pagesSnapshot = await pagesCollection
      .where('projectId', '==', projectId)
      .orderBy('metadata.sidebarPosition', 'asc')
      .get();
    
    const pages = pagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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

    const projectDoc = await projectsCollection.doc(projectId).get();
    if (!projectDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const project = projectDoc.data();
    const exportDir = path.join(__dirname, '../../export', project?.slug || projectId);

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
