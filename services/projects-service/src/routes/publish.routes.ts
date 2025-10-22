import express from 'express';
import {
  publishProject,
  unpublishProject,
  updatePublishSettings,
  checkSlugAvailability,
  generateSlug,
} from '../controllers/publish.controller';

const router = express.Router();

// Publish/unpublish routes
router.post('/projects/:projectId/publish', publishProject);
router.post('/projects/:projectId/unpublish', unpublishProject);
router.patch('/projects/:projectId/publish-settings', updatePublishSettings);

// Slug management
router.get('/slugs/:slug/availability', checkSlugAvailability);
router.post('/slugs/generate', generateSlug);

export default router;
