import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Firestore } from '@google-cloud/firestore';

const db = new Firestore();
const projectsCollection = db.collection('projects');

export const getTheme = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { projectId } = req.params;

    const projectDoc = await projectsCollection.doc(projectId).get();
    if (!projectDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const project = projectDoc.data();
    res.json({
      success: true,
      data: project?.theme || {},
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

    const projectRef = projectsCollection.doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await projectRef.update({
      theme: themeUpdates,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      data: themeUpdates,
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
