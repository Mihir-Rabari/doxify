import express from 'express';
import { body, param } from 'express-validator';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';

const router = express.Router();

// Validation middleware
const createValidation = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
];

const updateValidation = [
  param('id').isMongoId().withMessage('Invalid project ID'),
];

// Routes
router.post('/', createValidation, createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateValidation, updateProject);
router.delete('/:id', deleteProject);

export default router;
