import express from 'express';
import { body, param } from 'express-validator';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const createValidation = [
  body('name').notEmpty().withMessage('Project name is required'),
];

const updateValidation = [
  param('id').isMongoId().withMessage('Invalid project ID'),
];

// Routes (protected with authentication)
router.post('/', authenticate, createValidation, createProject);
router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProject);
router.put('/:id', authenticate, updateValidation, updateProject);
router.delete('/:id', authenticate, deleteProject);

export default router;
