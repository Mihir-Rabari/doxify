import express from 'express';
import {
  searchPages,
  getSearchSuggestions,
  getRecentPages,
} from '../controllers/search.controller';

const router = express.Router();

// Search routes
router.get('/projects/:projectId/search', searchPages);
router.get('/projects/:projectId/search/suggestions', getSearchSuggestions);
router.get('/projects/:projectId/search/recent', getRecentPages);

export default router;
