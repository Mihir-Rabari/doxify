import express from 'express';
import {
  getPublishedProject,
  getPublishedPages,
  getPublishedPage,
  getPublishedNavigation,
} from '../controllers/viewer.controller';

const router = express.Router();

// Public routes for viewing published documentation
router.get('/:slug', getPublishedProject);
router.get('/:slug/pages', getPublishedPages);
router.get('/:slug/pages/:pageSlug', getPublishedPage);
router.get('/:slug/navigation', getPublishedNavigation);

export default router;
