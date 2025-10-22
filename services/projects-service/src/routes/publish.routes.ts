import express from 'express';
import {
  publishProject,
  unpublishProject,
  updatePublishSettings,
  checkSlugAvailability,
  generateSlug,
} from '../controllers/publish.controller';

const router = express.Router();

// Publish/unpublish routes (mounted at /api/projects)
router.post('/:projectId/publish', publishProject);
router.post('/:projectId/unpublish', unpublishProject);
router.patch('/:projectId/publish-settings', updatePublishSettings);

// Slug management
router.get('/slugs/:slug/availability', checkSlugAvailability);
router.post('/slugs/generate', generateSlug);

export default router;
