import express from 'express';
import { body, param } from 'express-validator';
import {
  createPage,
  getPages,
  getPage,
  updatePage,
  deletePage,
  getPagePreview,
} from '../controllers/page.controller';

const router = express.Router();

// Validation middleware
const createValidation = [
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
];

const updateValidation = [
  param('id').isMongoId().withMessage('Invalid page ID'),
];

// Routes
router.post('/', createValidation, createPage);
router.get('/', getPages);
router.get('/:id', getPage);
router.get('/:id/preview', getPagePreview);
router.put('/:id', updateValidation, updatePage);
router.delete('/:id', deletePage);

export default router;
