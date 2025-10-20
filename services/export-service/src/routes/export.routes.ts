import express from 'express';
import { body } from 'express-validator';
import { exportProject, downloadExport } from '../controllers/export.controller';

const router = express.Router();

// Validation middleware
const exportValidation = [
  body('projectId').isMongoId().withMessage('Invalid project ID'),
];

// Routes
router.post('/build', exportValidation, exportProject);
router.get('/download/:projectId', downloadExport);

export default router;
