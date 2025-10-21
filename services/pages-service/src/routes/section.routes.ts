import express from 'express';
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} from '../controllers/section.controller';

const router = express.Router();

// Section routes
router.get('/projects/:projectId/sections', getSections);
router.post('/projects/:projectId/sections', createSection);
router.put('/sections/:sectionId', updateSection);
router.delete('/sections/:sectionId', deleteSection);

export default router;
