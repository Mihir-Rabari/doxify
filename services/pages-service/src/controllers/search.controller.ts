import { Request, Response } from 'express';
import { IPage } from '../models/page.model';
import { getPageRepository } from '../repositories/page.repository';

// Search pages - Client-side filtering for Firestore
export const searchPages = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { q, limit = 20, section } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const pageRepo = getPageRepository();
    const searchTerm = q.toLowerCase().trim();
    
    // Get all pages for the project
    let allPages = await pageRepo.findByProjectId(projectId as string);
    
    // Filter by section if provided
    if (section && typeof section === 'string') {
      allPages = allPages.filter(page => page.section === section);
    }

    // Search in title and content
    const searchResults = allPages.map(page => {
      let score = 0;
      let matchedIn = '';
      let preview = '';

      // Check title match (higher weight)
      if (page.title.toLowerCase().includes(searchTerm)) {
        score += 10;
        matchedIn = 'title';
      }

      // Check content match
      if (page.content && page.content.toLowerCase().includes(searchTerm)) {
        score += 5;
        if (!matchedIn) matchedIn = 'content';
        
        // Extract snippet
        const contentLower = page.content.toLowerCase();
        const index = contentLower.indexOf(searchTerm);
        if (index !== -1) {
          const start = Math.max(0, index - 50);
          const end = Math.min(page.content.length, index + searchTerm.length + 100);
          const snippet = page.content.substring(start, end).replace(/<[^>]*>/g, ' ').trim();
          preview = (start > 0 ? '...' : '') + snippet + (end < page.content.length ? '...' : '');
        }
      }

      // Check section match
      if (page.section.toLowerCase().includes(searchTerm)) {
        score += 2;
        if (!matchedIn) matchedIn = 'section';
      }

      return {
        ...page,
        score,
        matchedIn,
        preview: preview || (page.content ? page.content.substring(0, 150).replace(/<[^>]*>/g, ' ').trim() : ''),
      };
    })
    .filter(page => page.score > 0) // Only include matches
    .sort((a, b) => b.score - a.score) // Sort by relevance
    .slice(0, parseInt(limit as string, 10)); // Limit results

    res.json({
      query: q,
      count: searchResults.length,
      results: searchResults.map(({ score, matchedIn, preview, ...page }) => ({
        _id: page.id,
        title: page.title,
        slug: page.slug,
        section: page.section,
        score,
        matchedIn,
        preview,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search pages' });
  }
};

// Get search suggestions (autocomplete)
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { q, limit = 5 } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const pageRepo = getPageRepository();
    const allPages = await pageRepo.findByProjectId(projectId as string);
    const searchTerm = q.toLowerCase().trim();

    // Filter pages where title starts with or contains the search term
    const suggestions = allPages
      .filter(page => page.title.toLowerCase().includes(searchTerm))
      .sort((a, b) => {
        // Prioritize titles that start with the search term
        const aStarts = a.title.toLowerCase().startsWith(searchTerm);
        const bStarts = b.title.toLowerCase().startsWith(searchTerm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.order - b.order;
      })
      .slice(0, parseInt(limit as string, 10))
      .map(page => ({
        title: page.title,
        slug: page.slug,
        section: page.section,
      }));

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
};

// Get recent pages (for search UI)
export const getRecentPages = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { limit = 10 } = req.query;

    const pageRepo = getPageRepository();
    const allPages = await pageRepo.findByProjectId(projectId as string);

    // Sort by updatedAt descending
    const recentPages = allPages
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, parseInt(limit as string, 10))
      .map(page => ({
        title: page.title,
        slug: page.slug,
        section: page.section,
        updatedAt: page.updatedAt,
      }));

    res.json({ pages: recentPages });
  } catch (error) {
    console.error('Recent pages error:', error);
    res.status(500).json({ error: 'Failed to get recent pages' });
  }
};
