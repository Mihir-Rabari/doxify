import express from 'express';
import { body } from 'express-validator';
import { parseContent, renderContent } from '../controllers/parser.controller.js';

const router = express.Router();

// Validation middleware
const parseValidation = [
  body('content').notEmpty().withMessage('Content is required'),
];

// Routes
router.post('/parse', parseValidation, parseContent);
router.post('/render', parseValidation, renderContent);

export default router;
