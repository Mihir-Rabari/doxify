import express from 'express';
import { param } from 'express-validator';
import { getTheme, updateTheme } from '../controllers/theme.controller';

const router = express.Router();

// Validation middleware
const projectIdValidation = [
  param('projectId').isMongoId().withMessage('Invalid project ID'),
];

// Routes
router.get('/:projectId', projectIdValidation, getTheme);
router.put('/:projectId', projectIdValidation, updateTheme);

export default router;
